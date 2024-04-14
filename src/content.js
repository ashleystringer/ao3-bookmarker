import { averageReadingTime } from "./average-time-content.js";

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {

  if (message.event === "popupEvent") {

    const { isReadingTimeOn } = await chrome.storage.local.get(
      "isReadingTimeOn"
    );

    if (isReadingTimeOn == true) {
      chrome.storage.local.set({ isReadingTimeOn: false });
    } else {
      chrome.storage.local.set({ isReadingTimeOn: true });
    }

    averageReadingTime();
  }
});