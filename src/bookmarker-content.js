import { addIds, getWorkDataFromURL, removeMarkElement, calculateSelectionData } from "./utils.js";
import { createTooltip, removeTooltip, findTooltipLocation } from "./tooltip.js";

import Tooltip from "classes/Tooltip.js";
import TextSelector from 'classes/TextSelector.js';
import BookmarkManager from 'classes/BookmarkManager.js';
import StorageManager from 'classes/StorageManager.js';


const tooltip = Tooltip();
const textSelector = new TextSelector(tooltip);
const bookmarkManager = new BookmarkManager(tooltip, textSelector);
const storageManager = new StorageManager();

addIds();

bookmarkManager.getBookmarkByChapter();

window.addEventListener("load", async () => {

  // !!!! EVENT !!!!
  // !!!! BOOKMARK !!!!
  // !!!! STORAGE !!!!
  const { bookmarkByPage, pageChapterNumber } = await storageManager.get();

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

  const bookmarkedText = document.querySelector(".bookmarkedText");
  const tooltipElement = document.querySelector(".tooltip");

  const isSelectionCollapsed = document.getSelection().isCollapsed;

  console.log(document.getSelection());

  if(!isSelectionCollapsed && !bookmarkedText){
    textSelector.handleSelectedTextOption(tooltipElement);
  } else if(!isSelectionCollapsed && bookmarkedText){
    bookmarkManager.handleBookmarkedTextOption(e.target, bookmarkedText, tooltipElement, isSelectionCollapsed);
  }else{
    if(tooltipElement) this.tooltip.removeTooltip();
  }
});