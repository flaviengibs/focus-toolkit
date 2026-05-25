chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    todos: [],
    notes: [],
    savedTabs: []
  });
});
