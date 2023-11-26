const tooltip = (actionType) => {
  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");
  const btn = document.createElement("button");

  btn.innerText = actionType === "add-bookmark" ? "Add Bookmark" : "Remove Bookmark?";

  if(!btn.hasClickListener){
    btn.addEventListener("click", e => {
      e.stopPropagation();
      console.log("Button test");

      if(actionType === "add-bookmark"){
        addBookmark(e);
      }else{
        removeBookmark(e);
      }
    });
    btn.hasClickListener = true;
  }

  tooltip.appendChild(btn);

  return tooltip;
}

const getChapterFromURL = (url) => {
  const regex = /works\/(\d+).*chapters\/(\d+)/;

  const match = url.match(regex);

  if (match) {
    const workNumber = match[1];
    const chapterNumber = match[2];

    return { workNumber, chapterNumber };
  }

  return null;
}

const handleTextSelection = () => { 
  const selectionObject = document.getSelection();
  const anchorNode = selectionObject.anchorNode;
  const focusNode = selectionObject.focusNode;

  console.log(selectionObject);
  const tooltipElement = tooltip("add-bookmark");

  const range = document.createRange();

  const commonAncestorNode = selectionObject.getRangeAt(0).commonAncestorContainer;
  console.log(commonAncestorNode.contains(focusNode));

  if(commonAncestorNode.nodeName === "P" || commonAncestorNode.contains(anchorNode) && commonAncestorNode.contains(focusNode)){
  
    if(selectionObject.anchorOffset < selectionObject.focusOffset){
      range.setStart(selectionObject.anchorNode, selectionObject.anchorOffset);
      range.setEnd(selectionObject.focusNode, selectionObject.focusOffset);
    }else{
      range.setStart(selectionObject.focusNode, selectionObject.focusOffset);
      range.setEnd(selectionObject.anchorNode, selectionObject.anchorOffset);
    }
  
    if(!range.collapsed){
      console.log("range not collapsed");
      const spanElement = document.createElement("span");
      spanElement.className = "selectedText";
    
      spanElement.appendChild(range.extractContents());
  
      range.insertNode(spanElement);
      range.insertNode(tooltipElement); //tooltip created in other method
    }
  }

};

const handleBookmarkSelection = (e) => {
  console.log("handleBookmarkSelection");

  const tooltipElement = tooltip("remove-bookmark");

  const bookmarkedElement = e.target;
  bookmarkedElement.appendChild(tooltipElement);
}

const addBookmark = (e) => {
  const selectionObject = document.getSelection();
  const text = document.querySelector(".selectedText");
  text.classList.remove("selectedText");
  text.classList.add("bookmarkedText");

  text.addEventListener("click", e => { handleBookmarkSelection(e) });

  const parentNode = text.parentNode;
  const parentClass = text.parentNode.className;
  const tooltip = document.querySelector(`.${parentClass}`).querySelector(".tooltip");

  parentNode.removeChild(tooltip);

  const childNodesArray = Array.from(parentNode.childNodes);
  const anchorIndex = childNodesArray.indexOf(selectionObject.anchorNode);
  const focusIndex = childNodesArray.indexOf(selectionObject.focusNode);

  const { workNumber, chapterNumber } = getChapterFromURL(window.location.href);

  const bookmarkByPage = {
    workNumber: workNumber,
    chapterNumber: chapterNumber,
    parentClass: parentClass,
    anchorOffset: selectionObject.anchorOffset,
    anchorIndex: anchorIndex,
    focusOffset: selectionObject.focusOffset,
    focusIndex: focusIndex,
    bookmarkedText: text.textContent
  }
  
  chrome.storage.local.get("bookmarks", (result) => {
    let bookmarks = result.bookmarks || {};

    bookmarks[workNumber] = bookmarkByPage;
  
    chrome.storage.local.set({ bookmarks: bookmarks });
  });
  

}

const removeBookmark = (e) => {

  const bookmarkedElement = e.target.closest(".bookmarkedText");

  const tooltip = bookmarkedElement.querySelector(".tooltip");
  bookmarkedElement.removeChild(tooltip);

  const originalText = bookmarkedElement.innerHTML;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = originalText;

  while (tempDiv.firstChild) {
    bookmarkedElement.parentNode.insertBefore(tempDiv.firstChild, bookmarkedElement);
  }

  bookmarkedElement.parentNode.removeChild(bookmarkedElement);
  
  chrome.storage.local.get("bookmarks", (result) => {
    const { workNumber, chapterNumber } = getChapterFromURL(window.location.href);

    let bookmarks = result.bookmarks || {};

    delete bookmarks[workNumber];

    chrome.storage.local.set(result);
  });

}

const displayBookmark = (bookmarkByPage) => {
  console.log("bookmarkByPage");

  const range = document.createRange();

  // Get the parent node of the selection
  const parentNode = document.querySelector(`.${bookmarkByPage.parentClass}`);

  // Get the first and last child elements within the selection
  const startElement = parentNode.childNodes[bookmarkByPage.anchorIndex];
  const endElement = parentNode.childNodes[bookmarkByPage.focusIndex];

  console.log(parentNode.childNodes[0]);
  console.log(bookmarkByPage.focusIndex);

  // Set the start and end of the range to include all child elements within the selection
  range.setStartBefore(startElement);
  range.setEndAfter(endElement);

  if(!range.collapsed){
    console.log("range not collapsed");
    const spanElement = document.createElement("span");
    spanElement.className = "bookmarkedText";
  
    spanElement.appendChild(range.extractContents());

    spanElement.addEventListener("click", e => {handleBookmarkSelection(e)})

    range.insertNode(spanElement);
  }
}

const addIds = () => {
  const chapter = document
    .querySelector("#workskin")
    .querySelector("#chapters");
  const userstuff = chapter.querySelector(".userstuff.module");
  console.log(userstuff);

  userstuff.childNodes.forEach((child, index) => {
    if (child.nodeName !== "#text") {
      child.classList.add(`${child.nodeName}-${index}`);
      if (child.childNodes.length !== 0) {
        const childNodes = child.childNodes;
        let childIndex = 0;
        childNodes.forEach(childNode => {
          if (childNode.nodeName !== "#text") {
            childIndex++;
            childNode.classList.add(`${childNode.nodeName}-${childIndex}`);
          }
        });
      }
    }
  });
};

const removeIds = () => {
  const chapter = document
    .querySelector("#workskin")
    .querySelector("#chapters");
  const userstuff = chapter.querySelector(".userstuff.module");

  userstuff.childNodes.forEach((child, index) => {
    if (child.nodeName !== "#text") {
      child.classList.remove(`${child.nodeName}-${index}`);
      if (child.childNodes.length !== 0) {
        const childNodes = child.childNodes;
        let childIndex = 0;
        childNodes.forEach(childNode => {
          if (childNode.nodeName !== "#text") {
            childIndex++;
            childNode.classList.remove(`${childNode.nodeName}-${childIndex}`);
          }
        });
      }
    }
  });
  console.log(userstuff);
};

const checkIfBookmarkExists = async () => {
  const { bookmarks } = await chrome.storage.local.get("bookmarks");

  const { workNumber, chapterNumber } = getChapterFromURL(window.location.href);
  const bookmarkByPage = bookmarks[workNumber];

  if(bookmarkByPage && bookmarkByPage?.chapterNumber === chapterNumber){  
    console.log(bookmarkByPage);
    displayBookmark(bookmarkByPage);
  }
}

addIds();
checkIfBookmarkExists();

const chapter = document.querySelector("#workskin").querySelector("#chapters");

chapter.addEventListener("mouseup", (e) => {
  console.log("on mouse up");
  const selectedTextElement = document.querySelector(".selectedText");
  const bookmarkedText = document.querySelector(".bookmarkedText");
  const tooltipElement = document.querySelector(".tooltip");

  if(selectedTextElement && !selectedTextElement.contains(e.target) && !tooltipElement.contains(e.target)){
    console.log("selectedTextElement && !selectedTextElement.contains(e.target)");
    selectedTextElement.classList.remove("selectedText");
    selectedTextElement.parentNode.removeChild(tooltipElement);
  }else if(bookmarkedText && !bookmarkedText.contains(e.target) && !tooltipElement.contains(e.target)){
    bookmarkedText.removeChild(tooltipElement);
  }else{
    console.log("workskin");
    handleTextSelection();    
  }
});