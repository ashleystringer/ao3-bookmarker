console.log("service-worker.js");

/*
  Working idea - 
    * inject the average-time-content file using
    * * isReadingTimeOn in local storage
*/

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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.greeting === "popupEvent") {
    console.log("popupEvent");
    /*chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['average-time-content.js']
    });*/
  }
});
