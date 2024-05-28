export const addIds = () => {
    const chapter = document
      .querySelector("#workskin")
      .querySelector("#chapters");

    let userstuff;

    const module = chapter.querySelector(".module");
    if (module) {
      userstuff = chapter.querySelector(".userstuff.module")
    }else{
      userstuff = chapter.querySelector(".userstuff");
    }
  
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


export const removeIds = () => {
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
  };

export const getWorkDataFromURL = (url) => {
    let regex = /works\/(\d+).*chapters\/(\d+)/;
  
    let match = url.match(regex);

    if (match) {
      const workNumber = match[1];
      const urlChapterNumber = match[2];
      const pageChapterNumber = getChapterNumber();
  
      return { workNumber, urlChapterNumber, pageChapterNumber };
    }
    
    regex = /works\/(\d+)/;
    match = url.match(regex);
    const workNumber = match[1];
    return { workNumber, urlChapterNumber: 1, pageChapterNumber: 1 };
    //return null;
};


const getChapterNumber = () => {
    const chapter = document.querySelector("#workskin").querySelector(".chapter").querySelector("a").textContent;
    const regexChapter = /Chapter (\d+)/;
    return chapter.match(regexChapter)[1];
};

export const removeMarkElement = (element) => {
  const originalText = element.innerHTML;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = originalText;

  const parentNode = element.parentNode;

  while (tempDiv.firstChild) {
    parentNode.insertBefore(tempDiv.firstChild, element);
  }
  parentNode.removeChild(element);
  parentNode.normalize();
}

export async function calculateSelectionData(selection) {
  const bookmarkedText = document.querySelector(".bookmarkedText");

  const selectionAnchorOffset = selection.anchorOffset;
  const selectionFocusOffset = selection.focusOffset;

  let anchorNodeIndex = getNodeIndex(selection.anchorNode);
  let focusNodeIndex = getNodeIndex(selection.focusNode);
  

  // Check if there is bookmarked text in the same paragraph as the selection
  // Check if the selected text is in the same child element as the bookmarked text (How would I do that?)

  const selectionData = {
    anchorNodeIndex: anchorNodeIndex,
    anchorOffset: selection.anchorOffset,
    focusNodeIndex: focusNodeIndex,
    focusOffset: selection.focusOffset
  };

  if (!bookmarkedText) return selectionData; 

  if (bookmarkedText.closest("P") !== selection.anchorNode.parentNode.closest('P')) return selectionData;

  if (selection.focusNode.compareDocumentPosition(bookmarkedText) & Node.DOCUMENT_POSITION_FOLLOWING) return selectionData;

  const { bookmarks } = await chrome.storage.local.get("bookmarks");
  const { workNumber } = getChapterFromURL(window.location.href);
  const bookmarkByPage = bookmarks[workNumber];

  let recalculatedAnchorOffset = -1;
  let recalculatedAnchorNodeIndex = 0;
  let recalculatedFocusOffset = -1;
  let recalculatedFocusNodeIndex = 0;

  //If the anchor or focus node are element nodes, get the index this way.

  if (selection.anchorNode.previousSibling !== bookmarkedText){
    
    /*
    - for bookmarked texts that in nested elements in a paragraph, 
    - the indices of the root top elements in the paragraph aren't altered
    - and so, they can just be referenced without finding their distances from the bookmark
    */

    
    if (bookmarkedText.nodeName !== 'P'){
      return {
        anchorNodeIndex,
        focusNodeIndex,
        anchorOffset: selection.anchorOffset,
        focusOffset: selection.focusOffset
      };
    }
  

    const boomarkedTextParent = Array.from(bookmarkedText.parentNode.childNodes);
    const bookmarkedTextIndex = boomarkedTextParent.indexOf(bookmarkedText);
    let distanceFromBookmark = (anchorNodeIndex - bookmarkedTextIndex) - 1; //the structure is inherently different from the original structure
    recalculatedAnchorNodeIndex = bookmarkByPage.focusNodeIndex + distanceFromBookmark;
    //find a way to account for non-text elements
    distanceFromBookmark = focusNodeIndex - anchorNodeIndex; //focusNodeIndex - bookmarkedTextIndex
    recalculatedFocusNodeIndex = recalculatedAnchorNodeIndex + distanceFromBookmark;
    
    return {
      anchorNodeIndex: recalculatedAnchorNodeIndex,
      focusNodeIndex: recalculatedFocusNodeIndex,
      anchorOffset: selection.anchorOffset,
      focusOffset: selection.focusOffset
    };

  }

  recalculatedAnchorNodeIndex = bookmarkByPage.focusNodeIndex;
  recalculatedFocusNodeIndex = bookmarkByPage.focusNodeIndex + Math.abs(focusNodeIndex - anchorNodeIndex);

  // If the bookmarkedText has no child elements
  if (bookmarkedText.childNodes.length === 1) {
  // add the offset of its anchorIndex to the length of the bookmarkedText to the anchor offset of the selected text
    //offset of bookmarkedText
    const bookmarkAnchorOffset = bookmarkByPage.anchorOffset;
    //length of bookmarkedText
    const bookmarkedTextLength = bookmarkedText.textContent.length;
    //offset of selected text

    recalculatedAnchorOffset = bookmarkAnchorOffset + bookmarkedTextLength + selectionAnchorOffset;
    recalculatedFocusOffset = bookmarkAnchorOffset + bookmarkedTextLength + selectionFocusOffset;
  }else if (bookmarkedText.childNodes.length > 1){
    //add the length of the last child of the bookmarkedText to the anchor offset of the selected text
    //add the length of the last child of the bookmarkedText to the anchor offset of the selected text

    const lastChildOffset = bookmarkedText.lastChild.textContent.length;

    recalculatedAnchorOffset = lastChildOffset + selectionAnchorOffset;
    recalculatedFocusOffset = lastChildOffset + selectionFocusOffset;
    //BUG - This is assuming the focusNodeIndex of the selection object is what it would be without the mark element existing.
  }

  /*
  - REMEMBER - The node indices for after the element the bookmarkedText is within are incorrect.
  */

  // Return the recalculated selection data
  return {
    anchorNodeIndex: recalculatedAnchorNodeIndex,
    focusNodeIndex: recalculatedFocusNodeIndex,
    anchorOffset: recalculatedAnchorOffset,
    focusOffset: recalculatedFocusOffset
  };
}

function getNodeIndex(node){

  /*
  // A bug is here in the case of element nodes containing span tags
  */

  let childNodeArray;
  let nodeIndex;

  if (node.parentNode.nodeName === 'P'){
    childNodeArray = Array.from(node.parentNode.childNodes);
    nodeIndex = childNodeArray.indexOf(node);
  }else if (node.parentNode.nodeName !== 'P'){

    while(node.parentNode.nodeName !== 'P'){
      node = node.parentNode;
    }
    
    childNodeArray = Array.from(node.parentNode.childNodes);
    nodeIndex = childNodeArray.indexOf(node); //Why is this outputting 3?
  }

  return nodeIndex;
} //get original node index of a non-text node