const btnContainer = document.querySelector(".btn-container");

const btn = document.createElement("button");

const toggleReadingTime = async () => {
  const { isReadingTimeOn } = await chrome.storage.local.get("isReadingTimeOn");

  if (isReadingTimeOn == true) {
    btn.innerText = "Turn Reading Time OFF";
  } else {
    btn.innerText = "Turn Reading Time ON";
  }
};

window.onload = async e => {
  toggleReadingTime();
};

btn.addEventListener("click", async () => {
  toggleReadingTime(); //not sure why this isn't working
  await chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { event: "popupEvent" });
  });
});

btnContainer.appendChild(btn);
