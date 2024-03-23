export const addIds = () => {
    const chapter = document
      .querySelector("#workskin")
      .querySelector("#chapters");
    const userstuff = chapter.querySelector(".userstuff.module");
  
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

export const getChapterFromURL = (url) => {
    const regex = /works\/(\d+).*chapters\/(\d+)/;
  
    const match = url.match(regex);

    if (match) {
      const workNumber = match[1];
      const urlChapterNumber = match[2];
      const pageChapterNumber = getChapterNumber();
  
      return { workNumber, urlChapterNumber, pageChapterNumber };
    }
  
    return null;
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

  let childNodeArrayAnchor = Array.from(selection.anchorNode.parentNode.childNodes);
  let anchorNodeIndex = childNodeArrayAnchor.indexOf(selection.anchorNode);
  let childNodeArrayFocus = Array.from(selection.focusNode.parentNode.childNodes);
  let focusNodeIndex = childNodeArrayFocus.indexOf(selection.focusNode);

  // Check if there is bookmarked text in the same paragraph as the selection
  // Check if the selected text is in the same child element as the bookmarked text (How would I do that?)

  const selectionData = {
    anchorNodeIndex: anchorNodeIndex,
    anchorOffset: selection.anchorOffset,
    focusNodeIndex: focusNodeIndex,
    focusOffset: selection.focusOffset
  };

  if (!bookmarkedText) return selectionData; 


  const { bookmarks } = await chrome.storage.local.get("bookmarks");
  const { workNumber } = getChapterFromURL(window.location.href);
  const bookmarkByPage = bookmarks[workNumber];

  let recalculatedAnchorOffset = -1;
  let recalculatedAnchorNodeIndex = anchorNodeIndex - 2;
  let recalculatedFocusOffset = -1;
  let recalculatedFocusNodeIndex = focusNodeIndex - 2;

  if (selection.anchorNode.previousSibling !== bookmarkedText){
    const boomarkedTextParent = Array.from(bookmarkedText.parentNode.childNodes);
    const bookmarkedTextIndex = boomarkedTextParent.indexOf(bookmarkedText);
    let distanceFromBookmark = (anchorNodeIndex - bookmarkedTextIndex) - 1;
    recalculatedAnchorNodeIndex = bookmarkByPage.focusNodeIndex + distanceFromBookmark;
    distanceFromBookmark = focusNodeIndex - anchorNodeIndex; //focusNodeIndex - bookmarkedTextIndex
    recalculatedFocusNodeIndex = recalculatedAnchorNodeIndex + distanceFromBookmark;
    
    return {
      anchorNodeIndex: recalculatedAnchorNodeIndex,
      focusNodeIndex: recalculatedFocusNodeIndex,
      anchorOffset: selection.anchorOffset,
      focusOffset: selection.focusOffset
    };
  }

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

    recalculatedAnchorNodeIndex = bookmarkByPage.focusNodeIndex;
    recalculatedFocusNodeIndex = bookmarkByPage.focusNodeIndex + Math.abs(focusNodeIndex - anchorNodeIndex);
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