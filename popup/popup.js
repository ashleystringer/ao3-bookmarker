const readingTimeCheckbox = document.querySelector(".reading-time-checkbox");
const readingTimeCheckboxLabel = document.querySelector(".reading-time-checkbox-label");

window.onload = async e => {
  toggleReadingTimeCheckbox();
  createBookmarkList();
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

const createBookmarkList = async () => {

  const { bookmarks } = await chrome.storage.local.get("bookmarks");


  const template = document.getElementById("li_template");
  const elements = new Set();

  for (const bookmark of bookmarks){
    const element = template.content.firstElementChild.cloneNode(true);

    const title = bookmark.workNumber;
    const pathname = bookmark.workURL;

    element.querySelector(".title").textContent = title;
    element.querySelector(".pathname").textContent = pathname;

    /*element.querySelector("a").addEventListener("click", async (e) => {

    });*/

    elements.add(element);

  }

  document.querySelector("ul").append(...elements);
};