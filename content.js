console.log("content.js");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.event === "popupEvent") {
    console.log("popupEvent");
    //chrome.storage.local.set("isReadingTimeOn", true);
    chrome.runtime.sendMessage({ event: "popupEvent!" });
  }
});
