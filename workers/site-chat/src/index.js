const ALLOWED_ORIGINS = [
  "https://miumiu-op.github.io",
  "http://localhost:1313",
  "http://127.0.0.1:1313",
];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function json(data, status, origin, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(origin),
      ...extraHeaders,
    },
  });
}

function buildContext(documents) {
  return (documents || [])
    .map((doc) => {
      const bits = [`## ${doc.title || doc.id}`];
      if (doc.url) bits.push(`URL: ${doc.url}`);
      if (doc.tags?.length) bits.push(`Tags: ${doc.tags.join(", ")}`);
      if (doc.summary) bits.push(`Summary: ${doc.summary}`);
      bits.push((doc.text || "").trim());
      return bits.join("\n");
    })
    .join("\n\n---\n\n");
}

function clientIp(request) {
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

/**
 * Fixed-window rate limit via Cache API (no KV binding needed).
 * Returns { ok, retryAfterSec }.
 */
async function checkRateLimit(request, env) {
  const max = Number(env.RATE_LIMIT_MAX || 10);
  const windowSec = Number(env.RATE_LIMIT_WINDOW_SEC || 60);
  const ip = clientIp(request);
  const cacheKey = new Request(`https://miumiu-site-chat.rate-limit/${encodeURIComponent(ip)}`);
  const cache = caches.default;
  const now = Date.now();

  let count = 0;
  let resetAt = now + windowSec * 1000;

  const cached = await cache.match(cacheKey);
  if (cached) {
    try {
      const data = await cached.json();
      if (data.resetAt && data.resetAt > now) {
        count = Number(data.count) || 0;
        resetAt = data.resetAt;
      }
    } catch {
      // treat as empty window
    }
  }

  count += 1;
  if (count > max) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((resetAt - now) / 1000)),
    };
  }

  const ttlSec = Math.max(1, Math.ceil((resetAt - now) / 1000));
  await cache.put(
    cacheKey,
    new Response(JSON.stringify({ count, resetAt }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `max-age=${ttlSec}`,
      },
    })
  );

  return { ok: true, retryAfterSec: 0 };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, origin);
    }

    const limited = await checkRateLimit(request, env);
    if (!limited.ok) {
      return json(
        {
          error: `Too many requests. Try again in ${limited.retryAfterSec}s.`,
        },
        429,
        origin,
        { "Retry-After": String(limited.retryAfterSec) }
      );
    }

    if (!env.GEMINI_API_KEY) {
      return json({ error: "Server missing GEMINI_API_KEY" }, 500, origin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400, origin);
    }

    const question = String(body.question || "").trim();
    const lang = body.lang === "zh" ? "zh" : "en";

    if (!question) {
      return json({ error: "Question is required" }, 400, origin);
    }
    if (question.length > 500) {
      return json({ error: "Question is too long (max 500 characters)" }, 400, origin);
    }

    const siteBase = (env.SITE_BASE_URL || "https://miumiu-op.github.io").replace(/\/$/, "");
    const corpusUrl =
      lang === "zh" ? `${siteBase}/zh/chat-corpus.json` : `${siteBase}/chat-corpus.json`;

    let corpus;
    try {
      const corpusRes = await fetch(corpusUrl, {
        cf: { cacheTtl: 3600, cacheEverything: true },
      });
      if (!corpusRes.ok) {
        throw new Error(`corpus HTTP ${corpusRes.status}`);
      }
      corpus = await corpusRes.json();
    } catch (err) {
      return json({ error: `Failed to load site corpus: ${err.message}` }, 502, origin);
    }

    const context = buildContext(corpus.documents);
    const system = [
      "You are a helpful assistant for Miaomiao Pan's personal website.",
      "Answer ONLY using the website content provided below.",
      "If the answer is not in the content, say you don't know based on the site.",
      "Keep answers concise and clear (usually 2–6 short sentences).",
      "Reply in the same language as the user's question.",
      "",
      "WEBSITE CONTENT:",
      context,
    ].join("\n");

    const model = env.GEMINI_MODEL || "gemini-3.8-flash";
    const geminiUrl =
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent` +
      `?key=${encodeURIComponent(env.GEMINI_API_KEY)}`;

    let geminiRes;
    try {
      geminiRes = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: question }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 512,
          },
        }),
      });
    } catch (err) {
      return json({ error: `Gemini request failed: ${err.message}` }, 502, origin);
    }

    const geminiData = await geminiRes.json().catch(() => ({}));
    if (!geminiRes.ok) {
      const msg = geminiData?.error?.message || `Gemini HTTP ${geminiRes.status}`;
      return json({ error: msg }, 502, origin);
    }

    const answer =
      geminiData?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("")?.trim() || "";

    if (!answer) {
      return json({ error: "Empty response from model" }, 502, origin);
    }

    return json({ answer }, 200, origin);
  },
};
