import { addIds, removeIds, getChapterFromURL } from "./utils.js";
import { createTooltip, removeTooltip } from "./tooltip.js";

const handleTextSelection = (tooltipElement) => { 
  //VIOLATION OF SINGLE RESPONSIBILITY PRINCIPLE?

  const selectionObject = document.getSelection();
  const anchorNode = selectionObject.anchorNode;
  const focusNode = selectionObject.focusNode;

  console.log(selectionObject);

  console.log(tooltipElement);

  const range = document.createRange();

  const commonAncestorNode = selectionObject.getRangeAt(0).commonAncestorContainer;

  // ADDS THE SELECTEDTEXT CLASS TO THE SPAN ELEMENT AROUND THE SELECTED RANGE OF TEXT
  if(commonAncestorNode.nodeName === "P" || commonAncestorNode.contains(anchorNode) && commonAncestorNode.contains(focusNode)){
  
    if(selectionObject.anchorOffset < selectionObject.focusOffset){
      range.setStart(selectionObject.anchorNode, selectionObject.anchorOffset);
      range.setEnd(selectionObject.focusNode, selectionObject.focusOffset);
    }else{
      range.setStart(selectionObject.focusNode, selectionObject.focusOffset);
      range.setEnd(selectionObject.anchorNode, selectionObject.anchorOffset);
    }
    console.log(selectionObject.isCollapsed);
    console.log(range);
    console.log(range.toString());
    if(!range.collapsed){
      console.log("range not collapsed");
      const spanElement = document.createElement("span");
      spanElement.className = "selectedText";
    
      spanElement.appendChild(range.extractContents());
      spanElement.appendChild(tooltipElement);
  
      range.insertNode(spanElement);
    }
  }
  //  
};

const handleBookmarkSelection = (e) => {
  // ADD TOOLTIP TO REMOVE BOOKMARK
  console.log("Inside handleBookmarkSelection();");

  const tooltipElement = document.querySelector(".tooltip");

  if(tooltipElement == null){
    const newTooltipElement = createTooltip("-", removeBookmark);

    const bookmarkedElement = e.target;
    bookmarkedElement.appendChild(newTooltipElement);
  }
  //
}

const addBookmark = (e) => {

  //VIOLATION OF SINGLE RESPONSIBILITY PRINCIPLE?

  // REPLACING THE SELECTEDTEXT CLASS WITH THE BOOKMARKEDTEXT CLASS
  const workTitle = document.querySelector(".title").textContent;
  const selectionObject = document.getSelection();
  const selectedText = document.querySelector(".selectedText");
  selectedText.classList.remove("selectedText");
  selectedText.classList.add("bookmarkedText");
  //

  // ADDING EVENT LISTENER TO THE SELECTEDTEXT ELEMENT
  selectedText.addEventListener("click", e => { handleBookmarkSelection(e) });
  //

  const parentNode = selectedText.parentNode;
  const parentClass = selectedText.parentNode.className;

  removeTooltip(selectedText);

  // GETTING THE INDEX OF THE ANCHOR AND FOCUS NODES TO PUT INTO LOCAL STORAGE
  console.log(selectionObject);
  const childNodesArray = Array.from(parentNode.childNodes);
  console.log(childNodesArray);
  const anchorIndex = childNodesArray.indexOf(selectionObject.anchorNode);
  const focusIndex = childNodesArray.indexOf(selectionObject.focusNode);
  //

  // GETTING THE WORK NUMBER AND CHAPTER NUMBER FROM THE URL TO PUT INTO LOCAL STORAGE
  const { workNumber, chapterNumber } = getChapterFromURL(window.location.href);
  //

  console.log(anchorIndex);
  console.log(selectionObject.anchorNode);
  console.log(childNodesArray.indexOf(selectionObject.anchorNode));
  console.log(focusIndex);
  console.log(selectionObject.focusNode);
  console.log(childNodesArray.indexOf(selectionObject.focusNode));

  // ADDING TO LOCAL STORAGE
  const bookmarkByPage = {

    workURL: window.location.href,
    workTitle: workTitle,
    workNumber: workNumber,
    chapterNumber: chapterNumber,
    parentClass: parentClass,
    anchorOffset: selectionObject.anchorOffset,
    anchorIndex: anchorIndex,
    focusOffset: selectionObject.focusOffset,
    focusIndex: focusIndex,
    bookmarkedText: selectedText.textContent
  }

  console.log(bookmarkByPage);
  
  chrome.storage.local.get("bookmarks", (result) => {
    let bookmarks = result.bookmarks || {};

    bookmarks[workNumber] = bookmarkByPage;
  
    chrome.storage.local.set({ bookmarks: bookmarks });
  });
  //
}

const removeBookmark = (e) => {
  //VIOLATION OF SINGLE RESPONSIBILITY PRINCIPLE?

  // REMOVING THE BOOKMARKED SPAN ELEMENT
  const bookmarkedElement = document.querySelector(".bookmarkedText");
  removeTooltip(bookmarkedElement);

  const originalText = bookmarkedElement.innerHTML;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = originalText;

  while (tempDiv.firstChild) {
    bookmarkedElement.parentNode.insertBefore(tempDiv.firstChild, bookmarkedElement);
  }

  bookmarkedElement.parentNode.removeChild(bookmarkedElement);
  //
  
  // REMOVING THE BOOKMARK FROM LOCAL STORAGE
  chrome.storage.local.get("bookmarks", (result) => {
    const { workNumber, chapterNumber } = getChapterFromURL(window.location.href);

    let bookmarks = result.bookmarks || {};

    delete bookmarks[workNumber];

    chrome.storage.local.set(result);
  });
  //

}

const replaceBookmark = (e) => {
  removeBookmark(e);
  addBookmark(e);
}

const removeSelectedTextSpan = (selectedTextElement) => {
  // REMOVING THE SELECTEDTEXT SPAN ELEMENT
  const originalText = selectedTextElement.innerHTML;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = originalText;

  while (tempDiv.firstChild) {
    selectedTextElement.parentNode.insertBefore(tempDiv.firstChild, selectedTextElement);
  }
  selectedTextElement.parentNode.removeChild(selectedTextElement);
  //
}

const displayBookmark = (bookmarkByPage) => {
  //VIOLATION OF SINGLE RESPONSIBILITY PRINCIPLE?

  console.log("bookmarkByPage");

  const range = document.createRange();

  // Get the parent node of the selection
  const parentNode = document.querySelector(`.${bookmarkByPage.parentClass}`);

  // Get the first and last child elements within the selection
  const startElement = parentNode.childNodes[bookmarkByPage.anchorIndex];
  const endElement = parentNode.childNodes[bookmarkByPage.focusIndex];

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

const checkIfBookmarkExists = async () => {
  const { bookmarks } = await chrome.storage.local.get("bookmarks");
  console.log(bookmarks);

  const { workNumber, chapterNumber } = getChapterFromURL(window.location.href);
  const bookmarkByPage = bookmarks[workNumber];

  if(bookmarkByPage && bookmarkByPage?.chapterNumber === chapterNumber){  
    displayBookmark(bookmarkByPage);
  }
}

addIds();
checkIfBookmarkExists();

const chapter = document.querySelector("#workskin").querySelector("#chapters");

chapter.addEventListener("mouseup", e => {
  //VIOLATION OF OPEN-CLOSED PRINCIPLE?

  const selectedTextElement = document.querySelector(".selectedText");
  const bookmarkedText = document.querySelector(".bookmarkedText");
  const tooltipElement = document.querySelector(".tooltip");

  const isSelectionCollapsed = document.getSelection().isCollapsed;

  if(selectedTextElement){
    handleSelectedTextOption(e.target, selectedTextElement, tooltipElement);
  }else if(bookmarkedText){
    handleBookmarkedTextOption(e.target, bookmarkedText, tooltipElement, isSelectionCollapsed);
  }else{
    //This needs to exist in order to create selectedTextElement in the first place
    console.log("handleTextSelection() in mouseup event listener");
    const tooltipElement = createTooltip("+", addBookmark);
    handleTextSelection(tooltipElement);
  }
});

function handleSelectedTextOption(targetElement, selectedTextElement, tooltipElement) {
  if (!selectedTextElement.contains(targetElement) && !tooltipElement.contains(targetElement)) {
    removeTooltip(selectedTextElement);
    removeSelectedTextSpan(selectedTextElement);
  }else{
    console.log("handleTextSelection() in handleSelectedTextOption");
    const tooltipElement = createTooltip("+", addBookmark);
    handleTextSelection(tooltipElement);
  }
}

function handleBookmarkedTextOption(targetElement, bookmarkedText, tooltipElement, isSelectionCollapsed) {
  if (!bookmarkedText.contains(targetElement) && tooltipElement && !tooltipElement.contains(targetElement)) {
    removeTooltip(bookmarkedText);
  } else if (!bookmarkedText.contains(targetElement) && !tooltipElement && !isSelectionCollapsed) {
    console.log("Do you wish to bookmark this text?");
    const tooltipElement = createTooltip("?", replaceBookmark);
    handleTextSelection(tooltipElement);
  } else if (bookmarkedText.contains(targetElement) && !isSelectionCollapsed) {
    console.log("bookmarkedText && bookmarkedText.contains(targetElement) && !isSelectionCollapsed");
  }
}


/*
  - CASES
    - When user selects a piece of text -> handleTextSelection()
    - When user bookmarks a piece of text -> addBookmark()
    - When user clicks outside a selected piece of text -> removeSelectedTextSpan()
    - When user clicks outside a bookmarked piece of text without selecting other text -> handleTextSelection()
    - When user selects a piece of text when there's already a bookmark -> "Do you wish to bookmark this text?"
    - When user clicks on a bookmarked piece of text -> handleTextSelection() | handleBookmarkSelection() -> removeBookmark()
    - When user clicks anywhere on the page without selecting text -> handleTextSelection()
*/