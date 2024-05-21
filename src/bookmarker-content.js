import { addIds, getChapterFromURL, removeMarkElement, calculateSelectionData } from "./utils.js";
import { createTooltip, removeTooltip, findTooltipLocation } from "./tooltip.js";


function handleSelectedTextOption(targetElement, selectedTextElement, tooltipElement) {
  //**** THIS IS IN PROGRESS ****
  if (tooltipElement) {
    removeTooltip();
  }else{
    handleTextSelection("add");
  }
}

function handleBookmarkedTextOption(targetElement, bookmarkedText, tooltipElement, isSelectionCollapsed) {
  if (!bookmarkedText.contains(targetElement) && tooltipElement && !tooltipElement.contains(targetElement)) {
    removeTooltip(bookmarkedText);
  } else if (!bookmarkedText.contains(targetElement) && !tooltipElement && !isSelectionCollapsed) {
    handleTextSelection("replace");
  } else if (bookmarkedText.contains(targetElement) && !isSelectionCollapsed) {
    console.log("bookmarkedText && bookmarkedText.contains(targetElement) && !isSelectionCollapsed");
  }
}

const handleTextSelection = async (tooltipType) => {

  const selectionObject = document.getSelection();
  const selectionObjectRect = document.getSelection().getRangeAt(0).getBoundingClientRect();


  const anchorNode = selectionObject.anchorNode;
  const focusNode = selectionObject.focusNode;


  const anchorParagraph = anchorNode.parentNode.nodeName === 'P' ? anchorNode.parentNode : anchorNode.parentNode.closest('P');
  const focusParagraph = focusNode.parentNode.nodeName === 'P' ? focusNode.parentNode : focusNode.parentNode.closest('P');

  if (anchorParagraph !== focusParagraph) return;

  const tooltip = createPositionedTooltip(selectionObjectRect, tooltipType, selectionObject);

  document.body.appendChild(tooltip); 
}

const getBookmarkByChapter = async () => {
  const { bookmarks } = await chrome.storage.local.get("bookmarks");
  console.log(bookmarks);

  const { workNumber, pageChapterNumber } = getChapterFromURL(window.location.href);
  const bookmarkByPage = bookmarks[workNumber];

  console.log(bookmarkByPage);
  console.log(`bookmarkByPage.pageChapterNumber: ${bookmarkByPage.pageChapterNumber}`);

  if(bookmarkByPage && bookmarkByPage?.pageChapterNumber === pageChapterNumber){  
    displayBookmark(bookmarkByPage);
  }
}

const displayBookmark = (bookmarkByPage) => {
  //VIOLATION OF SINGLE RESPONSIBILITY PRINCIPLE?

  console.log("displayBookmark");
  console.log(bookmarkByPage);

  // Get the parent node of the selection
  const parentNode = document.querySelector(`.${bookmarkByPage.parentClass}`);

  console.log(parentNode.childNodes);

  let anchorNode = parentNode.childNodes[bookmarkByPage.anchorNodeIndex]; //This assumes this is a text node.
  let focusNode = parentNode.childNodes[bookmarkByPage.focusNodeIndex]; //This assumes this is a text node.

  console.log(anchorNode); 
  if(anchorNode.nodeType === 1) anchorNode = getFirstTextNode(anchorNode); //anchorNode = anchorNode.firstChild;
  console.log("anchorNode"); 
  console.log(anchorNode); 


  if(focusNode.nodeType === 1) focusNode = getFirstTextNode(focusNode); //focusNode = focusNode.firstChild;
  //if the anchor or focus node is an element node, get the first child of that element node

  console.log(anchorNode.nodeType, focusNode.nodeType);

  const anchorOffset = bookmarkByPage.anchorOffset;
  const focusOffset = bookmarkByPage.focusOffset;

  console.log(`anchorOffset: ${anchorOffset}, focusOffset: ${focusOffset}`);
  
  const range = modifiedRange({ anchorNode, anchorOffset, focusNode, focusOffset }, bookmarkByPage);

  if(!range.collapsed){
    console.log("range not collapsed");
    const markElement = document.createElement("mark");
    markElement.className = "bookmarkedText";
  
    markElement.appendChild(range.extractContents());

    markElement.addEventListener("click", e => {handleBookmarkSelection(e)})

    range.insertNode(markElement);
  }
}

const getFirstTextNode = (node) => {
  if(node.nodeType === Node.TEXT_NODE && node.nodeValue !== '\n') return node; 

  let result = null;
  for (let i = 0; i < node.childNodes.length && result === null; i++) {
    result = getFirstTextNode(node.childNodes[i]);
  }
  return result;
};

const handleBookmarkSelection = (e) => {
  // ADD TOOLTIP TO REMOVE BOOKMARK

  const tooltipElement = document.querySelector(".tooltip");

  if(tooltipElement == null){

    const bookmarkedElement = e.target.closest(".bookmarkedText");
    const bookmarkedElementRect = bookmarkedElement.getBoundingClientRect();

    const newTooltipElement = createPositionedTooltip(bookmarkedElementRect, "delete");

    document.body.appendChild(newTooltipElement); 
  }
}

const createPositionedTooltip = (elementRect, tooltipType, selectionObject) => {

  let tooltip; 

 if (tooltipType === "add"){
   tooltip = createTooltip("+", () => addBookmark(selectionObject));
 }else if (tooltipType === "replace"){
   tooltip = createTooltip("?", () => replaceBookmark(selectionObject));
 }else if (tooltipType === "delete"){
   tooltip = createTooltip("-", removeBookmark);
 }

 findTooltipLocation(elementRect, tooltip);

 return tooltip;

}

const replaceBookmark = (selectionObject) => {
  removeBookmark();
  addBookmark(selectionObject);
}

const removeBookmark = (e) => {

  const bookmarkedElement = document.querySelector(".bookmarkedText");
  removeMarkElement(bookmarkedElement);

  removeTooltip();
  
  // REMOVING THE BOOKMARK FROM LOCAL STORAGE
  chrome.storage.local.get("bookmarks", (result) => {
    const { workNumber } = getChapterFromURL(window.location.href);

    let bookmarks = result.bookmarks || {};

    delete bookmarks[workNumber];

    chrome.storage.local.set(result);
  });

}

const addBookmark = async (selectionObject) => {

  console.log("addBookmark");

  let bookmarkByPage = await applyBookmarkedText(selectionObject);
  const workNumber = bookmarkByPage.workNumber;

  const bookmarkedText = document.querySelector(".bookmarkedText");

  const parentClass = bookmarkedText.parentNode.closest('P').className; //selectedText.parentNode.className;

  bookmarkByPage.parentClass = parentClass;

  removeTooltip();
  

  // GETTING THE WORK NUMBER AND CHAPTER NUMBER FROM THE URL TO PUT INTO LOCAL STORAGE

  chrome.storage.local.get("bookmarks", (result) => {
    let bookmarks = result.bookmarks || {};

    bookmarks[workNumber] = bookmarkByPage;
  
    chrome.storage.local.set({ bookmarks: bookmarks });
  });
}

const applyBookmarkedText = async (selectionObject) => {

  const { 
    anchorOffset,
    anchorNodeIndex,
    focusOffset,
    focusNodeIndex
  } = await calculateSelectionData(selectionObject);

  console.log(`anchorOffset: ${anchorOffset}, anchorNodeIndex: ${anchorNodeIndex}, focusOffset: ${focusOffset}, focusNodeIndex: ${focusNodeIndex}`);

  const anchorNode = selectionObject.anchorNode;
  const focusNode = selectionObject.focusNode;

  const commonAncestorNode = selectionObject.getRangeAt(0).commonAncestorContainer;
  if(commonAncestorNode.nodeName === "P" || commonAncestorNode.contains(anchorNode) && commonAncestorNode.contains(focusNode)){

    //if anchorNode and focusNode are nodes other than text nodes

    let range;
    if(anchorOffset === selectionObject.anchorOffset && focusOffset === selectionObject.focusOffset){
      range = modifiedRange({ anchorNode, anchorOffset, focusNode, focusOffset }, selectionObject);
    }else{
      const originalAnchorOffset = selectionObject.anchorOffset;
      const originalFocusOffset = selectionObject.focusOffset;

      range = modifiedRange({ anchorNode, anchorOffset: originalAnchorOffset, focusNode, focusOffset: originalFocusOffset }, selectionObject);
    }

    const anchorParagraph = anchorNode.parentNode.nodeName === 'P' ? anchorNode.parentNode : anchorNode.parentNode.closest('P');
    const focusParagraph = focusNode.parentNode.nodeName === 'P' ? focusNode.parentNode : focusNode.parentNode.closest('P');
  
    if (anchorParagraph !== focusParagraph) return;

    if(!range.collapsed){
      console.log("range not collapsed");

      const markElement = document.createElement("mark");
      markElement.className = "bookmarkedText";
    
      markElement.appendChild(range.extractContents());
      markElement.addEventListener("click", e => { handleBookmarkSelection(e) });
  
      range.insertNode(markElement);
    }

  const { workNumber, urlChapterNumber, pageChapterNumber } = getChapterFromURL(window.location.href);


  const authorName = document.querySelector(".byline").querySelector("a").textContent;
  const workTitle = document.querySelector(".title").textContent;


  console.log("commonAncestorNode.nodeName");
  console.log(commonAncestorNode.nodeName);

  const selectedTextByPage = {
    authorName,
    workTitle,
    workNumber,
    workURL: window.location.href,
    urlChapterNumber,
    pageChapterNumber,
    anchorOffset, //recreated anchorOffset 
    anchorNodeIndex, //recreated anchorNodeIndex
    anchorNodeClass: anchorNode.parentNode.className,
    focusOffset, //recreated focusOffset
    focusNodeIndex, //recreated focusNodeIndex
    focusNodeClass: focusNode.parentNode.className,
    //parentClass: commonAncestorNode.className //
    //bookmarkedText: selectedText.textContent
  }

  return selectedTextByPage;
  }
}

const modifiedRange = ({ anchorNode, anchorOffset, focusNode, focusOffset }, selectionObject) => {

  const range = document.createRange();

  if((anchorNode === focusNode) && (selectionObject.anchorOffset < selectionObject.focusOffset)){
    range.setStart(anchorNode, anchorOffset);
    range.setEnd(focusNode, focusOffset);
  }else if((anchorNode === focusNode) && (selectionObject.anchorOffset >= selectionObject.focusOffset)){      
    range.setStart(focusNode, focusOffset);
    range.setEnd(anchorNode, anchorOffset);
  }

  console.log(anchorNode);

  if((anchorNode !== focusNode) && (anchorNode.compareDocumentPosition(focusNode) & Node.DOCUMENT_POSITION_FOLLOWING)){
    range.setStart(anchorNode, anchorOffset);
    range.setEnd(focusNode, focusOffset);
  }else if((anchorNode !== focusNode) && !(anchorNode.compareDocumentPosition(focusNode) & Node.DOCUMENT_POSITION_FOLLOWING)){
    range.setStart(focusNode, focusOffset);
    range.setEnd(anchorNode, anchorOffset);
  }

  return range;
}

addIds();
getBookmarkByChapter();

window.addEventListener("load", async () => {
  const { bookmarks } = await chrome.storage.local.get("bookmarks");
  const { workNumber, urlChapterNumber } = getChapterFromURL(window.location.href);
  const bookmarkByPage = bookmarks[workNumber];

  if(bookmarkByPage === undefined || bookmarkByPage == null) return;

  console.log("bookmarkByPage");
  console.log(bookmarkByPage);

  if(bookmarkByPage.urlChapterNumber !== urlChapterNumber) return; 

  const parentNode = document.querySelector(`.${bookmarkByPage.parentClass}`);

  parentNode.scrollIntoView(true);
});

const chapter = document.querySelector("#workskin").querySelector("#chapters");

chapter.addEventListener("mouseup", e => {
  //VIOLATION OF OPEN-CLOSED PRINCIPLE?

  const selectedTextElement = document.querySelector(".selectedText"); // 1.
  const bookmarkedText = document.querySelector(".bookmarkedText");
  const tooltipElement = document.querySelector(".tooltip");

  const isSelectionCollapsed = document.getSelection().isCollapsed;

  console.log(document.getSelection());

  if(!isSelectionCollapsed && !bookmarkedText){
    handleSelectedTextOption(e.target, selectedTextElement, tooltipElement);
  } else if(!isSelectionCollapsed && bookmarkedText){
    handleBookmarkedTextOption(e.target, bookmarkedText, tooltipElement, isSelectionCollapsed);
  }else{
    console.log("else");
    if(tooltipElement){
      removeTooltip();
    }
  }
});