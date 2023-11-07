console.log("service-worker.js");

/*
  Working idea - 
    * inject the average-time-content file using
    * * isReadingTimeOn in local storage
*/

// Save default API suggestions
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    chrome.storage.local.set({
      isReadingTimeOn: false
    });
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
