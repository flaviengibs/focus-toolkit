const toggleBtn = document.getElementById("toggle");
const autoCheckbox = document.getElementById("auto");

// load settings
chrome.storage.local.get(["enabled", "auto"], (data) => {
  autoCheckbox.checked = data.auto ?? true;
});

// toggle auto
autoCheckbox.addEventListener("change", () => {
  chrome.storage.local.set({ auto: autoCheckbox.checked });
});

// toggle dark mode
toggleBtn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const data = await chrome.storage.local.get("enabled");
  const enabled = !data.enabled;

  await chrome.storage.local.set({ enabled });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
  
  chrome.tabs.sendMessage(tab.id, {
    action: enabled ? "enable" : "disable"
  });
});
