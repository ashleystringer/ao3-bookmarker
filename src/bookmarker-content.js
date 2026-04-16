import { addIds, createPositionedTooltip } from "./utils.js";
//import { createTooltip, removeTooltip, findTooltipLocation } from "./tooltip.js";
import  Tooltip  from "./classes/Tooltip.js";
import TextSelector  from './classes/TextSelector.js';
import BookmarkManager from './classes/BookmarkManager.js';
import StorageManager  from './classes/StorageManager.js';



const tooltip = new Tooltip();
const textSelector = new TextSelector(tooltip);
const bookmarkManager = new BookmarkManager(tooltip, textSelector);
const storageManager = new StorageManager();

addIds();

bookmarkManager.getBookmarkByChapter();

window.addEventListener("load", async () => {

  console.log("Load event");

  // !!!! EVENT !!!!
  // !!!! BOOKMARK !!!!
  // !!!! STORAGE !!!!
  const { bookmarkByPage, pageChapterNumber } = await storageManager.get();
  //The above code is returning an error because there are no bookmarks.

  if(bookmarkByPage === undefined || bookmarkByPage == null) return;

  console.log("bookmarkByPage");
  console.log(bookmarkByPage);

  if(bookmarkByPage.urlChapterNumber !== urlChapterNumber) return; 

  const parentNode = document.querySelector(textSelector.modifiedParentClass(bookmarkByPage.parentClass));

  // Find a way to dynamically place multiple classes in the querySelector above

  console.log(parentNode);

  parentNode.scrollIntoView(true);
});

const chapter = document.querySelector("#workskin").querySelector("#chapters");

chapter.addEventListener("mouseup", e => {

  // !!!! EVENT !!!!
  // !!!! TEXT SELECTION !!!!
  // !!!! BOOKMARK !!!!
  // !!!! TOOLTIP !!!!

  console.log("mouse up event");

  const bookmarkedText = document.querySelector(".bookmarkedText");
  const tooltipElement = document.querySelector(".tooltip");

  const isSelectionCollapsed = document.getSelection().isCollapsed;

  console.log(document.getSelection());

  if(!isSelectionCollapsed && !bookmarkedText){
    //textSelector.handleSelectedTextOption(tooltipElement);
    //tooltipElement ? this.tooltip.removeTooltip() : this.handleTextSelection("add");
    //const { selectionObjectRect,  selectionObject } = textSelector.handleTextSelection();
    //document.body.appendChild(createPositionedTooltip({ selectionObjectRect,  selectionObject }, tooltip, 'add'));

    test(textSelector, tooltip, bookmarkManager);
  } else if(!isSelectionCollapsed && bookmarkedText){
    console.log("after !isSelectionCollapsed && bookmarkedText");
    bookmarkManager.handleBookmarkedTextOption(e.target, bookmarkedText, tooltipElement, isSelectionCollapsed);
  }else{
    console.log("else statement in mouseup event");
    if(tooltipElement) tooltip.removeTooltip();
  }
});

function test(textSelector, tooltip, bookmarkManager){
  const tooltipElement = document.querySelector(".tooltip"); //FIX THIS
  if (tooltipElement){ 
    tooltip.removeTooltip(); 
    return;
  }
  const { selectionData } = textSelector.handleTextSelection();
  
  document.body.appendChild(createPositionedTooltip(selectionData, tooltip, 'add', (data) => bookmarkManager.addBookmark(data)));
}