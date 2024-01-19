console.log("popup.js");
const readingTimeCheckbox = document.querySelector(".reading-time-checkbox");
const readingTimeCheckboxLabel = document.querySelector(".reading-time-checkbox-label");

window.onload = async e => {
  toggleReadingTimeCheckbox();
  //createBookmarkList();
  const { bookmarks } = await chrome.storage.local.get("bookmarks");
  console.log(bookmarks);
  updateBookmarkList(bookmarks);
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

chrome.storage.onChanged.addListener((changes, areaName) => {
  console.log("chrome.storage.onChange");
  if(changes.bookmarks && areaName === "local"){
    console.log(changes.bookmarks.newValue);
    updateBookmarkList(changes.bookmarks.newValue);
  }
});

const updateBookmarkList = (bookmarks) => {
  const ul = document.querySelector("ul");
  ul.innerHTML = ''; // clear the list
  console.log(bookmarks);
  for(const bookmark in bookmarks){
    console.log(bookmarks[bookmark].workNumber);
    const template = document.querySelector(".li_template");
    const element = template.content.firstElementChild.cloneNode(true);

    console.log(bookmark);

    element.querySelector(".title").textContent = `Work number: ${bookmarks[bookmark].workNumber}`;
    const anchor = element.querySelector("a");
    anchor.href = `${bookmarks[bookmark].workURL}`;
  
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: anchor.href });
    });

    ul.append(element);
  }
}
