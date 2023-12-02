const readingTimeCheckbox = document.querySelector(".reading-time-checkbox");
const readingTimeCheckboxLabel = document.querySelector(".reading-time-checkbox-label");

window.onload = async e => {
  toggleReadingTimeCheckbox();
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

