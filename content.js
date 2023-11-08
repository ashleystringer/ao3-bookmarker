console.log("content.js");

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.event === "popupEvent") {
    console.log("popupEvent");

    const { isReadingTimeOn } = await chrome.storage.local.get(
      "isReadingTimeOn"
    );

    if (isReadingTimeOn == true) {
      console.log("isReadingTimeOn: true");
      chrome.storage.local.set({ isReadingTimeOn: false });
    } else {
      console.log("isReadingTimeOn: false");
      chrome.storage.local.set({ isReadingTimeOn: true });
    }
  }
});

/*const getReadingTimeBtnText = async () => {
  const { isReadingTimeOn } = await chrome.storage.local.get("isReadingTimeOn");

  return "Hello.";
};*/

const getReadingTimeBtnText = async () => {
  const { isReadingTimeOn } = await chrome.storage.local.get("isReadingTimeOn");

  return isReadingTimeOn;
};

console.log(getReadingTimeBtnText());
