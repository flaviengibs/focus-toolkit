let enabled = false;

function applyDarkMode() {
  if (enabled) return;
  enabled = true;

  const style = document.createElement("style");
  style.id = "dark-mode-style";

  style.textContent = `
    html {
      background: #111 !important;
      color: #eee !important;
    }

    img, video {
      filter: brightness(0.8) contrast(1.2);
    }
  `;

  document.head.appendChild(style);
}

function removeDarkMode() {
  enabled = false;
  const style = document.getElementById("dark-mode-style");
  if (style) style.remove();
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "enable") applyDarkMode();
  if (msg.action === "disable") removeDarkMode();
});
