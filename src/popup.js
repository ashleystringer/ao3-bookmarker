console.log("popup.js");
const readingTimeCheckbox = document.querySelector(".reading-time-checkbox");
const readingTimeCheckboxLabel = document.querySelector(".reading-time-checkbox-label");

window.onload = async e => {
  toggleReadingTimeCheckbox();
  const { bookmarks } = await chrome.storage.local.get("bookmarks");
  console.log(bookmarks);
  updateBookmarkList(bookmarks);
};

const toggleReadingTimeCheckbox = async () => {
  const { isReadingTimeOn } = await chrome.storage.local.get("isReadingTimeOn");
  console.log(`isReadingTimeOn: ${isReadingTimeOn}`);
  readingTimeCheckbox.checked = isReadingTimeOn;
}

readingTimeCheckbox.addEventListener("change", async (e) => { 
  console.log("readingTimeCheckbox event listener"); 

  await chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const activeTab = tabs[0];
    if(activeTab.status === 'complete'){
      chrome.tabs.sendMessage(activeTab.id, { event: "popupEvent" });
      console.log("readingTimeCheckbox event listener: sendMessage");
    }
  });
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  console.log("chrome.storage.onChange");
  if(changes.bookmarks && areaName === "local"){
    console.log(changes.bookmarks.newValue);
    updateBookmarkList(changes.bookmarks.newValue);
    updateBadge(changes.bookmarks.newValue);
  }
});

const updateBadge = async (bookmarks) => {
  console.log(`number of bookmarks: ${Object.keys(bookmarks).length}`);
  chrome.action.setBadgeText({text: `${Object.keys(bookmarks).length}`});
}

const updateBookmarkList = (bookmarks) => {
  // VIOLATES THE SINGLE RESPONSIBILITY PRINCIPLE?

  const ul = document.querySelector("ul");
  ul.innerHTML = ''; // clear the list

  for(const bookmark in bookmarks){
    console.log(bookmarks[bookmark].workNumber);
    const template = document.querySelector(".li_template");
    const element = template.content.firstElementChild.cloneNode(true);

    element.querySelector(".title").textContent = bookmarks[bookmark].workTitle;
    const anchor = element.querySelector("a");
    anchor.href = `${bookmarks[bookmark].workURL}`;

   element.querySelector(".pathname").textContent = bookmarks[bookmark].chapterNumber;
  
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: anchor.href });
    });

    ul.append(element);
  }
}
