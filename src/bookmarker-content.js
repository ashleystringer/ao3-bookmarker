import { addIds, getChapterFromURL, removeMarkElement, recalculateSelectionData } from "./utils.js";
import { createTooltip, removeTooltip } from "./tooltip.js";

function handleSelectedTextOption(targetElement, selectedTextElement, tooltipElement) {
  if (!selectedTextElement.contains(targetElement) && !tooltipElement.contains(targetElement)) {
    removeTooltip(selectedTextElement);
    removeSelectedTextSpan(selectedTextElement);
  }
}

const removeSelectedTextSpan = (selectedTextElement) => {
  removeMarkElement(selectedTextElement);
}

function handleBookmarkedTextOption(targetElement, bookmarkedText, tooltipElement, isSelectionCollapsed) {
  if (!bookmarkedText.contains(targetElement) && tooltipElement && !tooltipElement.contains(targetElement)) {
    removeTooltip(bookmarkedText);
  } else if (!bookmarkedText.contains(targetElement) && !tooltipElement && !isSelectionCollapsed) {
    const tooltipElement = createTooltip("?", replaceBookmark);
    handleTextSelection(tooltipElement);
  } else if (bookmarkedText.contains(targetElement) && !isSelectionCollapsed) {
    console.log("bookmarkedText && bookmarkedText.contains(targetElement) && !isSelectionCollapsed");
  }
}

const replaceBookmark = (e) => {
  //find some way to alter selectedTextData before addBookmark is called
  removeBookmark(e);
  addBookmark(e);
}

const removeBookmark = (e) => {
  //VIOLATION OF SINGLE RESPONSIBILITY PRINCIPLE?

  // REMOVING THE BOOKMARKED SPAN ELEMENT
  const bookmarkedElement = document.querySelector(".bookmarkedText");
  removeTooltip(bookmarkedElement);

  removeMarkElement(bookmarkedElement);
  
  // REMOVING THE BOOKMARK FROM LOCAL STORAGE
  chrome.storage.local.get("bookmarks", (result) => {
    const { workNumber } = getChapterFromURL(window.location.href);

    let bookmarks = result.bookmarks || {};

    delete bookmarks[workNumber];

    chrome.storage.local.set(result);
  });
  //

}

const addBookmark = async (e) => {

  console.log("addBookmark() called.");

  //VIOLATION OF SINGLE RESPONSIBILITY PRINCIPLE?

  // REPLACING THE SELECTEDTEXT CLASS WITH THE BOOKMARKEDTEXT CLASS
  const authorName = document.querySelector(".byline").querySelector("a").textContent;
  const workTitle = document.querySelector(".title").textContent;
  const selectionObject = document.getSelection();
  const selectedText = document.querySelector(".selectedText");
  selectedText.classList.remove("selectedText");
  selectedText.classList.add("bookmarkedText");

  const { anchorOffset, anchorNodeIndex, focusOffset, focusNodeIndex } = await selectedTextData();
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
  //

  // GETTING THE WORK NUMBER AND CHAPTER NUMBER FROM THE URL TO PUT INTO LOCAL STORAGE
  const { workNumber, urlChapterNumber, pageChapterNumber } = getChapterFromURL(window.location.href);
  //

  console.log("anchorOffset");
  console.log(anchorOffset);
  console.log("anchorNodeIndex");
  console.log(anchorNodeIndex);

  console.log("selectionObject.anchorOffset");
  console.log(selectionObject.anchorOffset);
  console.log(childNodesArray.indexOf(selectionObject.anchorNode));

  console.log("focusOffset");
  console.log(focusOffset);
  console.log("focusNodeIndex");
  console.log(focusNodeIndex);

  console.log("focusOffset");
  console.log(focusOffset);
  console.log("selectionObject.focusOffset");
  console.log(selectionObject.focusOffset);
  console.log(childNodesArray.indexOf(selectionObject.focusNode));

  // ADDING TO LOCAL STORAGE
  const bookmarkByPage = {
    authorName,
    workURL: window.location.href,
    workTitle,
    workNumber,
    urlChapterNumber,
    pageChapterNumber,
    parentClass,
    anchorOffset,
    anchorNodeIndex,
    focusOffset,
    focusNodeIndex,
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

const selectedTextData = async () => {
  const { selectedTextData } = await chrome.storage.local.get("selectedTextData");

  return selectedTextData
}

const handleTextSelection = (tooltipElement) => {
  //VIOLATION OF SINGLE RESPONSIBILITY PRINCIPLE?

  console.log("Inside handleTextSelection();");

  const selectionObject = document.getSelection();

  recalculateSelectionData(selectionObject);

  const anchorNode = selectionObject.anchorNode;
  const anchorOffset = selectionObject.anchorOffset;
  const focusNode = selectionObject.focusNode;
  const focusOffset = selectionObject.focusOffset;

  const range = document.createRange();

  const commonAncestorNode = selectionObject.getRangeAt(0).commonAncestorContainer;

  // ADDS THE SELECTEDTEXT CLASS TO THE SPAN ELEMENT AROUND THE SELECTED RANGE OF TEXT

  //Account for a special element (like span or em) being the only child element of a paragraph.
  
  if(commonAncestorNode.nodeName === "P" || commonAncestorNode.contains(anchorNode) && commonAncestorNode.contains(focusNode)){
  
    console.log("anchor offset");
    console.log(anchorOffset);
    
    console.log("focus offset");
    console.log(focusOffset);

    if(selectionObject.anchorOffset < selectionObject.focusOffset){
      range.setStart(selectionObject.anchorNode, anchorOffset);
      range.setEnd(selectionObject.focusNode, focusOffset);
    }else{
      range.setStart(selectionObject.focusNode, focusOffset);
      range.setEnd(selectionObject.anchorNode, anchorOffset);
    }

    const anchorParagraph = anchorNode.parentNode.nodeName === 'P' ? anchorNode.parentNode : anchorNode.parentNode.closest('P');
    const focusParagraph = focusNode.parentNode.nodeName === 'P' ? focusNode.parentNode : focusNode.parentNode.closest('P');
  
    if (anchorParagraph !== focusParagraph) {
      // If they are not within the same paragraph, clear the selection
      //window.getSelection().removeAllRanges();
      console.log("Not within the same paragraph");
      return;
    }

    console.log(selectionObject.isCollapsed);
    console.log(range);
    console.log(range.toString());
    if(!range.collapsed){
      console.log("range not collapsed");

      const markElement = document.createElement("mark");
      markElement.className = "selectedText";
    
      markElement.appendChild(range.extractContents());
      markElement.appendChild(tooltipElement);
  
      range.insertNode(markElement);
    }
  }

  
  const childNodesArray = Array.from(selectionObject.anchorNode.parentNode.childNodes);
  const childNodesArray1 = Array.from(selectionObject.focusNode.parentNode.childNodes);

  const anchorNodeIndex = childNodesArray.indexOf(selectionObject.anchorNode);
  const focusNodeIndex = childNodesArray1.indexOf(selectionObject.focusNode);
  

  console.log(`selectionObject.anchorOffset: ${selectionObject.anchorOffset}`);
  console.log(`anchorOffst: ${anchorOffset}`);
  
  console.log(`selectionObject.focusOffset: ${selectionObject.focusOffset}`);
  console.log(`focusOffset: ${focusOffset}`);

  /*
    - if there is bookmarkedText exists within a paragraph,
    - find a way the anchor and focus nodes and offsets as if the bookmarkedText doesn't exist
    
  */

  const selectedTextByPage = {
    anchorOffset, //recreated anchorOffset 
    anchorNodeIndex, //recreated anchorNodeIndex
    focusOffset, //recreated focusOffset
    focusNodeIndex, //recreated focusNodeIndex
  }

  chrome.storage.local.set({ selectedTextData: selectedTextByPage }); //There is a bug caused by this.
};

const getBookmarkByChapter = async () => {
  const { bookmarks } = await chrome.storage.local.get("bookmarks");
  console.log(bookmarks);

  const { workNumber, chapterNumber } = getChapterFromURL(window.location.href);
  const bookmarkByPage = bookmarks[workNumber];

  if(bookmarkByPage && bookmarkByPage?.chapterNumber === chapterNumber){  
    displayBookmark(bookmarkByPage);
  }
}

const displayBookmark = (bookmarkByPage) => {
  //VIOLATION OF SINGLE RESPONSIBILITY PRINCIPLE?

  console.log(bookmarkByPage);

  const range = document.createRange();

  // Get the parent node of the selection
  const parentNode = document.querySelector(`.${bookmarkByPage.parentClass}`);

  // Get the first and last child elements within the selection
  const anchorNode = parentNode.childNodes[bookmarkByPage.anchorNodeIndex];
  const focusNode = parentNode.childNodes[bookmarkByPage.focusNodeIndex];

  const anchorOffset = bookmarkByPage.anchorOffset;
  const focusOffset = bookmarkByPage.focusOffset;

  console.log(parentNode);

  console.log(anchorNode);
  console.log(focusNode);

  console.log("bookmarkByPage.anchorOffset");
  console.log(bookmarkByPage.anchorOffset);

  console.log("bookmarkByPage.focusOffset");
  console.log(bookmarkByPage.focusOffset);

  // Set the start and end of the range to include all child elements within the selection
  //range.setStartBefore(anchorNode);
  //range.setEndAfter(focusNode);
  
  if(bookmarkByPage.anchorOffset < bookmarkByPage.focusOffset){
    range.setStart(anchorNode, anchorOffset);
    range.setEnd(focusNode, focusOffset);
  }else{
    range.setStart(focusNode, focusOffset);
    range.setEnd(anchorNode, anchorOffset);
  }


  if(!range.collapsed){
    console.log("range not collapsed");
    const markElement = document.createElement("mark");
    markElement.className = "bookmarkedText";
  
    markElement.appendChild(range.extractContents());

    markElement.addEventListener("click", e => {handleBookmarkSelection(e)})

    range.insertNode(markElement);
  }
}

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

addIds();
getBookmarkByChapter();

const chapter = document.querySelector("#workskin").querySelector("#chapters");

chapter.addEventListener("mouseup", e => {
  //VIOLATION OF OPEN-CLOSED PRINCIPLE?

  const selectedTextElement = document.querySelector(".selectedText"); // 1.
  const bookmarkedText = document.querySelector(".bookmarkedText");
  const tooltipElement = document.querySelector(".tooltip");

  const isSelectionCollapsed = document.getSelection().isCollapsed;

  if(selectedTextElement){
    handleSelectedTextOption(e.target, selectedTextElement, tooltipElement);
  }else if(bookmarkedText){
    handleBookmarkedTextOption(e.target, bookmarkedText, tooltipElement, isSelectionCollapsed);
  }else{
    //This needs to exist in order to create selectedTextElement in the first place
    const tooltipElement = createTooltip("+", addBookmark);
    handleTextSelection(tooltipElement);
  }
});