import { addIds, removeIds, getChapterFromURL } from "../src/utils.js";
import { Tooltip } from "../src/tooltip.js";

export const tooltip = (actionType) => {
  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");

  const btnDiv = document.createElement("button");
  btnDiv.classList.add("btn");

  btnDiv.innerText = actionType === "add-bookmark" ? "+" : "-";

  if(!btnDiv.hasClickListener){
    btnDiv.addEventListener("click", e => {
      e.stopPropagation();
      console.log("Button test");

      if(actionType === "add-bookmark"){
        addBookmark(e);
      }else{
        removeBookmark(e);
      }
    });
    btnDiv.hasClickListener = true;
  }

  tooltip.appendChild(btnDiv);

  return tooltip;
}

const handleTextSelection = () => { 
  const selectionObject = document.getSelection();
  const anchorNode = selectionObject.anchorNode;
  const focusNode = selectionObject.focusNode;

  console.log(selectionObject);
  const tooltipElement = tooltip("add-bookmark");
  //const tooltipElement = new Tooltip();
  //tooltipElement.addButton("+", addBookmark());

  const range = document.createRange();

  const commonAncestorNode = selectionObject.getRangeAt(0).commonAncestorContainer;
  //console.log(commonAncestorNode);

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
      //range.insertNode(tooltipElement); //tooltip created in other method
    }
  }
};

const handleBookmarkSelection = (e) => {
  //console.log("handleBookmarkSelection");

  const tooltipElement = document.querySelector(".tooltip");
  //console.log(tooltipElement);


  if(tooltipElement == null){
    const newTooltipElement = tooltip("remove-bookmark");
    //const tooltipElement = new Tooltip();
    //tooltipElement.addButton("+", addBookmark());
    const bookmarkedElement = e.target;
    bookmarkedElement.appendChild(newTooltipElement);
  }

}

const addBookmark = (e) => {
  const selectionObject = document.getSelection();
  const text = document.querySelector(".selectedText");
  text.classList.remove("selectedText");
  text.classList.add("bookmarkedText");

  text.addEventListener("click", e => { handleBookmarkSelection(e) });

  const parentNode = text.parentNode;
  const parentClass = text.parentNode.className;

  //const tooltip = document.querySelector(`.${parentClass}`).querySelector(".tooltip");
  const tooltip = text.querySelector(".tooltip");

  text.removeChild(tooltip);

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
    bookmarkedText: text.textContent
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

  //console.log(parentNode.childNodes[0]);
  //console.log(bookmarkByPage.focusIndex);

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
  const tooltipElement = document.querySelector(".tooltip");

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