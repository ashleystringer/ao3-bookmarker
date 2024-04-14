console.log("service-worker.js");

// Save default API suggestions

chrome.runtime.onInstalled.addListener(async () => {
  chrome.storage.local.set({
    isReadingTimeOn: true
  });

  const { bookmarks } = await chrome.storage.local.get("bookmarks");

  chrome.action.setBadgeBackgroundColor({ color: "#FF0000"});
  chrome.action.setBadgeTextColor({ color: "#FFFFFF"});
  chrome.action.setBadgeText({ text: `${Object.keys(bookmarks).length}` });
});