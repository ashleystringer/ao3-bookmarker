console.log("service-worker.js");

// Save default API suggestions
chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === "install") {
    chrome.storage.local.set({
      isReadingTimeOn: false
    });
  }
});

chrome.commands.onCommand.addListener(command => {
  console.log("chrome.commands.onCommand");
  if (command === "toggle-popup") {
    chrome.browserAction.openPopup();
  }
});