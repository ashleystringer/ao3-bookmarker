console.log("popup.js");


const readingTimeCheckbox = document.querySelector(".reading-time-checkbox");
const readingTimeCheckboxLabel = document.querySelector(".reading-time-checkbox-label");

window.onload = async e => {
  toggleReadingTimeCheckbox();
  //createBookmarkList();
};

const toggleReadingTimeCheckbox = async () => {
  const { isReadingTimeOn } = await chrome.storage.local.get("isReadingTimeOn");

  readingTimeCheckbox.checked = isReadingTimeOn;
}

readingTimeCheckbox.addEventListener("change", async (e) => {  
  await chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { event: "popupEvent" });
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.event === "bookmarkAdded"){

    const template = document.querySelector(".li_template");
    const element = template.content.firstElementChild.cloneNode(true);

    element.querySelector(".title").textContent = "Title";
    element.querySelector(".pathname").textContent = "Pathname";
  
    elements.add(element);

    document.querySelector("ul").append(...elements);

    sendResponse({ status: "success" });

    /*chrome.storage.local.get("bookmarks", (result) => {

      const elements = new Set();
  
  
      if(result.bookmarks && Object.keys(result.bookmarks).length > 0){
        for(let bookmark in result.bookmarks) {
          const element = template.content.firstElementChild.cloneNode(true);
          const title = bookmark.workNumber;
          const pathname = bookmark.workURL;
      
          element.querySelector(".title").textContent = "title";
          element.querySelector(".pathname").textContent = "pathname";
      
          elements.add(element);
        }
      }
      document.querySelector("ul").append(...elements);
    });*/
  }
});
