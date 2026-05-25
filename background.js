// initialise une vérif toutes les 5 minutes
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("darkModeCheck", {
    periodInMinutes: 5
  });
});

chrome.alarms.onAlarm.addListener(async () => {
  const { enabled, auto } = await chrome.storage.local.get({
    enabled: true,
    auto: true
  });

  if (!enabled || !auto) return;

  const hour = new Date().getHours();
  const shouldEnable = hour >= 19 || hour < 7;

  if (shouldEnable) {
    const tabs = await chrome.tabs.query({});
    for (let tab of tabs) {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, { action: "enable" });
      }
    }
  }
});
