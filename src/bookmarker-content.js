import { addIds, getWorkDataFromURL, removeMarkElement, calculateSelectionData } from "./utils.js";
import { createTooltip, removeTooltip, findTooltipLocation } from "./tooltip.js";


/*
  class TextSelector {
    constructor(tooltip){
      this.tooltip = tooltip; 
      }
    
    handleSelectedTextOption(tooltipElement) {
        // !!!! TOOLTIP !!!! 
        // !!!! TEXT SELECTION !!!!

        tooltipElement ? removeTooltip() : handleTextSelection("add");
      }
    async handleTextSelection (tooltipType) {
        // !!!! TEXT SELECTION !!!!
        // !!!! TOOLTIP !!!!

        const selectionObject = document.getSelection();
        const selectionObjectRect = document.getSelection().getRangeAt(0).getBoundingClientRect();


        const anchorNode = selectionObject.anchorNode;
        const focusNode = selectionObject.focusNode;


        const anchorParagraph = anchorNode.parentNode.nodeName === 'P' ? anchorNode.parentNode : anchorNode.parentNode.closest('P');
        const focusParagraph = focusNode.parentNode.nodeName === 'P' ? focusNode.parentNode : focusNode.parentNode.closest('P');

        if (anchorParagraph !== focusParagraph) return;

        this.tooltip.createPositionedTooltip(selectionObjectRect, tooltipType, selectionObject);

        document.body.appendChild(tooltip); 
      }
    }

    getFirstTextNode(node){ //- Save for utils.js?
      // !!!! TEXT SELECTION !!!!

      if(node.nodeType === Node.TEXT_NODE && node.nodeValue !== '\n'  && node.nodeValue !== '&nbsp;') return node; 

      let result = null;
      for (let i = 0; i < node.childNodes.length && result === null; i++) {
        result = getFirstTextNode(node.childNodes[i]);
      }
      return result;
  };

    modifiedRange({ anchorNode, anchorOffset, focusNode, focusOffset }, selectionObject){
      // !!!! TEXT SLECTION !!!!

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


    modifiedParentClass(parentClassStr){ //- Save for util.js
      // !!!! TEXT SELECTION !!!!

      const parentClassArray = parentClassStr.split(" ");
      const newArray = parentClassArray.map(parentClass => `.${parentClass}`);

      return newArray.join("");
    }

    //handleSelectedTextOption - needs tooltip - PASTED
    //???? handleBookmarkedTextOption - needs tooltip
    //handleTextSelection - needs tooltip - PASTED
    //getFirstTextNode - PASTED //- save for utils.js
    //modifiedRange - PASTED
    //modifiedParentClass - PASTED //- save for utils.js?


    //~~ functions in utils.js ~~

    //addIds
    //removeIds
    //getWorkDataFromURL ????
    //getChapterNumber
    //getNodeIndex
  }

  class BookmarkManager {
    constructor(tooltip, textSelector){
      this.tooltip = tooltip;
      this.textSelector = textSelector;
    }

    function handleBookmarkedTextOption(targetElement, bookmarkedText, tooltipElement, isSelectionCollapsed) {
  // !!!! TEXT SELECTION !!!!
  if (!bookmarkedText.contains(targetElement) && tooltipElement && !tooltipElement.contains(targetElement)) {
    removeTooltip(bookmarkedText);
  } else if (!bookmarkedText.contains(targetElement) && !tooltipElement && !isSelectionCollapsed) {
    handleTextSelection("replace");
    }
  }

  async getBookmarkByChapter(){
  // !!!! BOOKMARK !!!!
  // !!!! STORAGE !!!!!

    const { bookmarks } = await chrome.storage.local.get("bookmarks");
    console.log(bookmarks);

    const { workNumber, pageChapterNumber } = getWorkDataFromURL(window.location.href);
    const bookmarkByPage = bookmarks[workNumber];

    console.log(bookmarkByPage);
    console.log(`bookmarkByPage.pageChapterNumber: ${bookmarkByPage.pageChapterNumber}`);

    if(bookmarkByPage && bookmarkByPage?.pageChapterNumber === pageChapterNumber){  
      displayBookmark(bookmarkByPage);
    }
  }

  displayBookmark(bookmarkByPage){
  // !!!! BOOKMARK !!!!
  // !!!! TEXT SELECTION !!!!

  console.log("displayBookmark");
  console.log(bookmarkByPage);

  // Get the parent node of the selection
  const parentNode = document.querySelector(modifiedParentClass(bookmarkByPage.parentClass));


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

function handleBookmarkSelection(e){
  // !!!! TEXT SELECTION !!!!
  // !!!! TOOLTIP !!!!

  // ADD TOOLTIP TO REMOVE BOOKMARK

  const tooltipElement = document.querySelector(".tooltip");

  if(tooltipElement == null){

    const bookmarkedElement = e.target.closest(".bookmarkedText");
    const bookmarkedElementRect = bookmarkedElement.getBoundingClientRect();

    const newTooltipElement = createPositionedTooltip(bookmarkedElementRect, "delete");

    document.body.appendChild(newTooltipElement); 
  }
}

  replaceBookmark(selectionObject){ 
    // !!!! BOOKMARK !!!! 
    removeBookmark();
    addBookmark(selectionObject);
  }

  removeBookmark(e){
  // !!!! BOOKMARK !!!!
  // !!!! TOOLTIP !!!!
  // !!!! STORAGE !!!!

  const bookmarkedElement = document.querySelector(".bookmarkedText");
  removeMarkElement(bookmarkedElement);

  removeTooltip();
  
  // REMOVING THE BOOKMARK FROM LOCAL STORAGE
  chrome.storage.local.get("bookmarks", (result) => {
    const { workNumber } = getWorkDataFromURL(window.location.href);

    let bookmarks = result.bookmarks || {};

    delete bookmarks[workNumber];

    chrome.storage.local.set(result);
  });

}

async addBookmark(selectionObject){

  // !!!! BOOKMARK !!!!
  // !!!! TOOLTIP !!!!
  // !!!! STORAGE !!!!

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

async applyBookmarkedText(selectionObject){

  // !!!! TEXT SELECTION !!!!
  // !!!! BOOKMARK !!!!

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

  const { workNumber, urlChapterNumber, pageChapterNumber } = getWorkDataFromURL(window.location.href);


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

    //???? handleBookmarkedTextOption - needs tooltip - PASTED
    //getBookmarkByChapter - needs storage - PASTED
    //displayBookmark - needs text selection - PASTED
    //handleBookmarkSelection - needs text selection and tooltip - PASTED
    //replaceBookmark - PASTED
    //removeBookmark - needs tooltip and storage - PASTED
    //addBookmark - needs tooltip and storage - PASTED
    //applyBookmarkedText - needs text selection - PASTED


    //~~ functions in utils.js ~~

    //calculateSelectionData
    //removeMarkElement

  }

  class Tooltip{
    constructor(){
    }
    
    //createPositionedTooltip - PASTED

    createPositionedTooltip(elementRect, tooltipType, selectionObject){

      // !!!! TOOLTIP !!!!

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

    //~~ functions in tooltip.js ~~

   createTooltip(buttonMsg, callback){
    // CREATES TOOLTIP DIV
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip", "default", "faded-out");
    //

    requestAnimationFrame(() => {
      tooltip.classList.remove("faded-out");
    });

    // CREATES BUTTON DIV
    const btnDiv = document.createElement("button");
    btnDiv.classList.add("btn");

    btnDiv.innerText = buttonMsg;
    //

    // ADDS EVENT LISTENER TO BUTTON DIV
    if(!btnDiv.hasClickListener){
      btnDiv.addEventListener("click", e => {
        e.stopPropagation();

        callback(e);
      });
      btnDiv.hasClickListener = true;
    }
  //

  tooltip.appendChild(btnDiv);

  return tooltip;
}

  removeTooltip(parentElement){
    //**** THIS IS IN PROGRESS ****

    const tooltip = document.body.querySelector(".tooltip");
    if(tooltip == null) return;
    document.body.removeChild(tooltip);
  }

  findTooltipLocation(elementRect, tooltip){
  
      //**** THIS IS IN PROGRESS ****
    if (isTooltipUnderViewport(elementRect)){
      tooltip.style.top = elementRect.bottom + window.scrollY + "px";
      tooltip.style.left = (elementRect.left + elementRect.right) / 2 + "px";
      tooltip.classList.remove("default");
      tooltip.classList.add("tooltip", "dropdown");
    }else{
      tooltip.style.top = elementRect.top + window.scrollY - 80 + "px";
      tooltip.style.left = (elementRect.left + elementRect.right) / 2 + "px";
      tooltip.classList.add("tooltip", "default");
    }
  }

  isTooltipUnderViewport(elementRect){
  //const rect = element.getBoundingClientRect();
  if (elementRect.top <= 55) return true;
  }
    
    //createTooltip - PASTED
    //removeTooltip - PASTED
    //findTooltipLocation - PASTED
    //isTooltipUnderViewport - PASTED
  }
*/

function handleSelectedTextOption(tooltipElement) { //COPIED
  // !!!! TOOLTIP !!!! 
  // !!!! TEXT SELECTION !!!!

  tooltipElement ? removeTooltip() : handleTextSelection("add");
}

function handleBookmarkedTextOption(targetElement, bookmarkedText, tooltipElement, isSelectionCollapsed) { //COPIED
  // !!!! TEXT SELECTION !!!!
  if (!bookmarkedText.contains(targetElement) && tooltipElement && !tooltipElement.contains(targetElement)) {
    removeTooltip(bookmarkedText);
  } else if (!bookmarkedText.contains(targetElement) && !tooltipElement && !isSelectionCollapsed) {
    handleTextSelection("replace");
  }
}

const handleTextSelection = async (tooltipType) => { //COPIED
  // !!!! TEXT SELECTION !!!!
  // !!!! TOOLTIP !!!!

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

const getBookmarkByChapter = async () => { //COPIED
// !!!! BOOKMARK !!!!
// !!!! STORAGE !!!!!

  const { bookmarks } = await chrome.storage.local.get("bookmarks");
  console.log(bookmarks);

  const { workNumber, pageChapterNumber } = getWorkDataFromURL(window.location.href);
  const bookmarkByPage = bookmarks[workNumber];

  console.log(bookmarkByPage);
  console.log(`bookmarkByPage.pageChapterNumber: ${bookmarkByPage.pageChapterNumber}`);

  if(bookmarkByPage && bookmarkByPage?.pageChapterNumber === pageChapterNumber){  
    displayBookmark(bookmarkByPage);
  }
}

const displayBookmark = (bookmarkByPage) => { //COPIED
  // !!!! BOOKMARK !!!!
  // !!!! TEXT SELECTION !!!!

  console.log("displayBookmark");
  console.log(bookmarkByPage);

  // Get the parent node of the selection
  const parentNode = document.querySelector(modifiedParentClass(bookmarkByPage.parentClass));


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

const getFirstTextNode = (node) => { //COPIED
  // !!!! TEXT SELECTION !!!!

  if(node.nodeType === Node.TEXT_NODE && node.nodeValue !== '\n'  && node.nodeValue !== '&nbsp;') return node; 

  let result = null;
  for (let i = 0; i < node.childNodes.length && result === null; i++) {
    result = getFirstTextNode(node.childNodes[i]);
  }
  return result;
};

const handleBookmarkSelection = (e) => { //COPIED
  // !!!! TEXT SELECTION !!!!
  // !!!! TOOLTIP !!!!

  // ADD TOOLTIP TO REMOVE BOOKMARK

  const tooltipElement = document.querySelector(".tooltip");

  if(tooltipElement == null){

    const bookmarkedElement = e.target.closest(".bookmarkedText");
    const bookmarkedElementRect = bookmarkedElement.getBoundingClientRect();

    const newTooltipElement = createPositionedTooltip(bookmarkedElementRect, "delete");

    document.body.appendChild(newTooltipElement); 
  }
}

const createPositionedTooltip = (elementRect, tooltipType, selectionObject) => { //COPIED

  // !!!! TOOLTIP !!!!

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

const replaceBookmark = (selectionObject) => { //COPIED

  // !!!! BOOKMARK !!!! 

  removeBookmark();
  addBookmark(selectionObject);
}

const removeBookmark = (e) => { //COPIED

  // !!!! BOOKMARK !!!!
  // !!!! TOOLTIP !!!!
  // !!!! STORAGE !!!!

  const bookmarkedElement = document.querySelector(".bookmarkedText");
  removeMarkElement(bookmarkedElement);

  removeTooltip();
  
  // REMOVING THE BOOKMARK FROM LOCAL STORAGE
  chrome.storage.local.get("bookmarks", (result) => {
    const { workNumber } = getWorkDataFromURL(window.location.href);

    let bookmarks = result.bookmarks || {};

    delete bookmarks[workNumber];

    chrome.storage.local.set(result);
  });

}

const addBookmark = async (selectionObject) => { //COPIED

  // !!!! BOOKMARK !!!!
  // !!!! TOOLTIP !!!!
  // !!!! STORAGE !!!!

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

const applyBookmarkedText = async (selectionObject) => { //COPIED

  // !!!! TEXT SELECTION !!!!
  // !!!! BOOKMARK !!!!

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

  const { workNumber, urlChapterNumber, pageChapterNumber } = getWorkDataFromURL(window.location.href);


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

const modifiedRange = ({ anchorNode, anchorOffset, focusNode, focusOffset }, selectionObject) => { //COPIED

  // !!!! TEXT SLECTION !!!!

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

  // !!!! EVENT !!!!
  // !!!! BOOKMARK !!!!
  // !!!! STORAGE !!!!

  const { bookmarks } = await chrome.storage.local.get("bookmarks");
  const { workNumber, urlChapterNumber } = getWorkDataFromURL(window.location.href);
  const bookmarkByPage = bookmarks[workNumber];

  if(bookmarkByPage === undefined || bookmarkByPage == null) return;

  console.log("bookmarkByPage");
  console.log(bookmarkByPage);

  if(bookmarkByPage.urlChapterNumber !== urlChapterNumber) return; 

  
  const parentNode = document.querySelector(modifiedParentClass(bookmarkByPage.parentClass));

  // Find a way to dynamically place multiple classes in the querySelector above

  console.log(parentNode);

  parentNode.scrollIntoView(true);
});


const modifiedParentClass = (parentClassStr) => { //COPIED
  // !!!! TEXT SELECTION !!!!

	const parentClassArray = parentClassStr.split(" ");
	const newArray = parentClassArray.map(parentClass => `.${parentClass}`);

	return newArray.join("");
}


const chapter = document.querySelector("#workskin").querySelector("#chapters");

chapter.addEventListener("mouseup", e => {

  // !!!! EVENT !!!!
  // !!!! TEXT SELECTION !!!!
  // !!!! BOOKMARK !!!!
  // !!!! TOOLTIP !!!!

  const selectedTextElement = document.querySelector(".selectedText"); // 1.
  const bookmarkedText = document.querySelector(".bookmarkedText");
  const tooltipElement = document.querySelector(".tooltip");

  const isSelectionCollapsed = document.getSelection().isCollapsed;

  console.log(document.getSelection());

  if(!isSelectionCollapsed && !bookmarkedText){
    handleSelectedTextOption(tooltipElement);
    //handleSelectedTextOption(e.target, selectedTextElement, tooltipElement);
  } else if(!isSelectionCollapsed && bookmarkedText){
    handleBookmarkedTextOption(e.target, bookmarkedText, tooltipElement, isSelectionCollapsed);
  }else{
    if(tooltipElement){
      removeTooltip();
    }
  }
});