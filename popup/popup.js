const btnContainer = document.querySelector(".btn-container");

const btn = document.createElement("button");

btn.innerText = "Button";

btn.addEventListener("click", async () => {
  console.log("click");
  await chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { event: "popupEvent" });
  });
});

btnContainer.appendChild(btn);
