(function () {
  const el = document.getElementById("site-visit-count");
  if (!el) return;

  const endpoint = (el.dataset.endpoint || "").replace(/\/$/, "");
  if (!endpoint) return;

  const url = endpoint + "/visits";

  fetch(url, { method: "POST", mode: "cors" })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (data && typeof data.count === "number") {
        el.textContent = data.count.toLocaleString();
      }
    })
    .catch(function () {
      // Keep placeholder empty if counter is unavailable
    });
})();
