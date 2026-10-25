(function () {
  const root = document.getElementById("site-chat");
  if (!root) return;

  const fab = document.getElementById("site-chat-fab");
  const panel = document.getElementById("site-chat-panel");
  const closeBtn = document.getElementById("site-chat-close");
  const form = document.getElementById("site-chat-form");
  const input = document.getElementById("site-chat-input");
  const messages = document.getElementById("site-chat-messages");
  const workerUrl = (root.dataset.workerUrl || "").trim();
  const lang = root.dataset.lang || "en";

  root.hidden = false;

  function addBubble(text, role, muted) {
    const el = document.createElement("div");
    el.className =
      "site-chat__bubble site-chat__bubble--" +
      role +
      (muted ? " site-chat__bubble--muted" : "");
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
    return el;
  }

  function setOpen(open) {
    panel.hidden = !open;
    fab.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) input.focus();
  }

  fab.addEventListener("click", () => setOpen(panel.hidden));
  closeBtn.addEventListener("click", () => setOpen(false));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;

    if (!workerUrl) {
      addBubble(root.dataset.missingWorker || "Chat backend is not configured yet.", "bot", true);
      return;
    }

    addBubble(question, "user");
    input.value = "";
    const thinking = addBubble(root.dataset.thinking || "Thinking…", "bot", true);
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    input.disabled = true;

    try {
      const res = await fetch(workerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, lang }),
      });
      const data = await res.json().catch(() => ({}));
      thinking.remove();
      if (!res.ok || !data.answer) {
        addBubble(data.error || root.dataset.error || "Something went wrong.", "bot", true);
      } else {
        addBubble(data.answer, "bot");
      }
    } catch (err) {
      thinking.remove();
      addBubble(root.dataset.error || "Something went wrong.", "bot", true);
    } finally {
      submitBtn.disabled = false;
      input.disabled = false;
      input.focus();
    }
  });
})();
