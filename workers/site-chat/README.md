# Site chat worker

Answers questions about the Hugo site using Gemini + the published `chat-corpus.json`.

## Deploy (once)

```bash
cd workers/site-chat
npm install
npx wrangler login
npx wrangler deploy
npx wrangler secret put GEMINI_API_KEY
```

Rate limit (default): **10 requests / IP / 60 seconds**. Change via `RATE_LIMIT_MAX` and `RATE_LIMIT_WINDOW_SEC` in `wrangler.toml`, then redeploy.

Copy the Worker URL (e.g. `https://miumiu-site-chat.<account>.workers.dev`) into root `config.yaml`:

```yaml
params:
  chat:
    enable: true
    workerUrl: "https://miumiu-site-chat.<account>.workers.dev"
```

Then commit, push, and let GitHub Pages rebuild so the chat UI can call the Worker.

## Local test

```bash
npx wrangler dev
# point chat.workerUrl to http://127.0.0.1:8787 for local Hugo + local Worker
```

Note: local Worker still fetches corpus from the live site unless you set `SITE_BASE_URL` to a locally reachable URL.
