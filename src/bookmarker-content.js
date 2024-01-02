import { addIds, removeIds, getChapterFromURL } from "./utils.js";
import { createTooltip, removeTooltip } from "./tooltip.js";

const handleTextSelection = () => { 
  const selectionObject = document.getSelection();
  const anchorNode = selectionObject.anchorNode;
  const focusNode = selectionObject.focusNode;

  console.log(selectionObject);
///!!!!!!! TOOLTIP !!!!!!! ///
  const tooltipElement = createTooltip("+", addBookmark);
///!!!!!!! TOOLTIP !!!!!!! ///

  console.log(tooltipElement);

  const range = document.createRange();

  const commonAncestorNode = selectionObject.getRangeAt(0).commonAncestorContainer;

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
};

const handleBookmarkSelection = (e) => {

  console.log("Inside handleBookmarkSelection();");
///!!!!!!! TOOLTIP !!!!!!! ///

  const tooltipElement = document.querySelector(".tooltip");

///!!!!!!! TOOLTIP !!!!!!! ///

///!!!!!!! TOOLTIP !!!!!!! ///
  if(tooltipElement == null){
    const newTooltipElement = createTooltip("-", removeBookmark);

    //const tooltipElement = new Tooltip();
    //tooltipElement.addButton("+", addBookmark());
    const bookmarkedElement = e.target;
    bookmarkedElement.appendChild(newTooltipElement);
  }
///!!!!!!! TOOLTIP !!!!!!! ///

}

const addBookmark = (e) => {
  const selectionObject = document.getSelection();
  const selectedText = document.querySelector(".selectedText");
  selectedText.classList.remove("selectedText");
  selectedText.classList.add("bookmarkedText");

  selectedText.addEventListener("click", e => { handleBookmarkSelection(e) });

  const parentNode = selectedText.parentNode;
  const parentClass = selectedText.parentNode.className;

  ///!!!!!!! TOOLTIP !!!!!!! ///
  const tooltip = selectedText.querySelector(".tooltip");

  selectedText.removeChild(tooltip);
  ///!!!!!!! TOOLTIP !!!!!!! ///

  console.log(selectionObject);
  const childNodesArray = Array.from(parentNode.childNodes);
  console.log(childNodesArray);
  const anchorIndex = childNodesArray.indexOf(selectionObject.anchorNode);
  const focusIndex = childNodesArray.indexOf(selectionObject.focusNode);

  const { workNumber, chapterNumber } = getChapterFromURL(window.location.href);

  console.log(anchorIndex);
  console.log(selectionObject.anchorNode);
  console.log(childNodesArray.indexOf(selectionObject.anchorNode));
  console.log(focusIndex);
  console.log(selectionObject.focusNode);
  console.log(childNodesArray.indexOf(selectionObject.focusNode));

  const bookmarkByPage = {
    workURL: window.location.href,
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
  

}

const removeBookmark = (e) => {

  const bookmarkedElement = e.target.closest(".bookmarkedText");

  ///!!!!!!! TOOLTIP !!!!!!! ///
  removeTooltip(bookmarkedElement);
  ///!!!!!!! TOOLTIP !!!!!!! ///

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

const removeSelectedTextSpan = (selectedTextElement, tooltipElement) => {
  selectedTextElement.removeChild(tooltipElement);

  const originalText = selectedTextElement.innerHTML;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = originalText;

  while (tempDiv.firstChild) {
    selectedTextElement.parentNode.insertBefore(tempDiv.firstChild, selectedTextElement);
  }
  selectedTextElement.parentNode.removeChild(selectedTextElement);
}

const displayBookmark = (bookmarkByPage) => {
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
    //console.log(bookmarkByPage);
    displayBookmark(bookmarkByPage);
  }
}

addIds();
checkIfBookmarkExists();

const chapter = document.querySelector("#workskin").querySelector("#chapters");

chapter.addEventListener("mouseup", (e) => {
  const selectedTextElement = document.querySelector(".selectedText");
  const bookmarkedText = document.querySelector(".bookmarkedText");
  ///!!!!!!! TOOLTIP !!!!!!! ///
  const tooltipElement = document.querySelector(".tooltip");
  ///!!!!!!! TOOLTIP !!!!!!! ///

  const isSelectionCollapsed = document.getSelection().isCollapsed;

  if(selectedTextElement && !selectedTextElement.contains(e.target) && !tooltipElement.contains(e.target)){
    removeSelectedTextSpan(selectedTextElement, tooltipElement);
  }else if(bookmarkedText && !bookmarkedText.contains(e.target) && tooltipElement && !tooltipElement.contains(e.target)){
    bookmarkedText.removeChild(tooltipElement);
  }else if(bookmarkedText && !bookmarkedText.contains(e.target) && !tooltipElement && !isSelectionCollapsed){
    console.log("bookmarkedText && !bookmarkedText.contains(e.target) && !tooltipElement && !isSelectionCollapsed");
    console.log("Do you wish to bookmark this text?");
    //handleTextSelection(tooltipType);
    //create a tooltip for this situation
  }else if(bookmarkedText && bookmarkedText.contains(e.target) && !isSelectionCollapsed){
    console.log("bookmarkedText && bookmarkedText.contains(e.target) && !isSelectionCollapsed");
    return;
  }else{
    console.log("handleTextSelection();");
    handleTextSelection();    
  }  
});