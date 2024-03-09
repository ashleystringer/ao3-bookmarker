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
  console.log("removeMarkElement");
  console.log(parentNode);

}

export async function recalculateSelectionData(selection) {
  console.log("recalculateSelectionData");
  console.log(selection);
  const bookmarkedText = document.querySelector(".bookmarkedText");

  const selectionAnchorOffset = selection.anchorOffset;
  const selectionFocusOffset = selection.focusOffset;

    // Check if there is bookmarked text in the same paragraph as the selection
  // Check if the selected text is in the same child element as the bookmarked text (How would I do that?)

  if (!bookmarkedText) return;


  if (selection.anchorNode.previousSibling !== bookmarkedText) return;

  console.log(`bookmarkedText.childNodes.length: ${bookmarkedText.childNodes.length}`);

  const { bookmarks } = await chrome.storage.local.get("bookmarks");
  const { workNumber } = getChapterFromURL(window.location.href);
  const bookmarkByPage = bookmarks[workNumber];

  console.log(bookmarkByPage);


  // If the bookmarkedText has no child elements
  if (bookmarkedText.childNodes.length === 1) {
  // add the offset of its anchorIndex to the length of the bookmarkedText to the anchor offset of the selected text
    //offset of bookmarkedText
    const bookmarkAnchorOffset = bookmarkByPage.anchorOffset;
    //length of bookmarkedText
    const bookmarkedTextLength = bookmarkedText.textContent.length;
    //offset of selected text
    //const selectionAnchorOffset = selection.anchorOffset;
    //const selectionFocusOffset = selection.focusOffset;

    const test = bookmarkAnchorOffset + bookmarkedTextLength + selectionAnchorOffset;

    console.log(`bookmarkAnchorOffset: ${bookmarkAnchorOffset}`);
    console.log(`bookmarkedTextLength: ${bookmarkedTextLength}`);
    console.log(`selectionAnchorOffset: ${selectionAnchorOffset}`);

    console.log(`bookmarkAnchorIndex + bookmarkedTextLength + selectionAnchorOffset: ${test}`);
    console.log(`bookmarkAnchorIndex + bookmarkedTextLength + selectionFocusOffset: ${bookmarkAnchorOffset + bookmarkedTextLength + selectionFocusOffset}`);
  }else if (bookmarkedText.childNodes.length > 1){
    //add the length of the last child of the bookmarkedText to the anchor offset of the selected text

    console.log(bookmarkedText.lastChild);

    //add the length of the last child of the bookmarkedText to the anchor offset of the selected text

    const lastChildOffset = bookmarkedText.lastChild.textContent.length;

    //const selectionAnchorOffset = selection.anchorOffset;
    //const selectionFocusOffset = selection.focusOffset;

    const test = lastChildOffset + selectionAnchorOffset;

    console.log(`lastChildOffset + selectionAnchorOffset: ${test}`);
    console.log(`lastChildOffset + selectionfocusOffset: ${lastChildOffset + selectionFocusOffset}`);
  }

  /*
  // If the bookmarkedText has child elements

  if (bookmarkedText.childNodes.length > 1) {
    //add the length of the last child of the bookmarkedText to the anchor offset of the selected text

    //const lastChildOffset = bookmarkedText.lastChild.textContent.length;

    //const selectionAnchorOffset = selection.anchorOffset;
  }
  */

    //const anchorNodeIndex = Array.from(paragraph.childNodes).indexOf(selection.anchorNode);
    //const focusNodeIndex = Array.from(paragraph.childNodes).indexOf(selection.focusNode);


  /*console.log(bookmarkedText.lastChild);

  let adjustment = bookmarkedText.textContent.length;
  console.log(`adjustment: ${adjustment}`);

  console.log(selection.anchorNode);

  console.log(`anchorOffset + adjustment`);
  console.log(selection.anchorOffset + adjustment);
  
  console.log(`focusOffset + adjustment`);
  console.log(selection.focusOffset + adjustment);*/
  /*const bookmarkedText = paragraph.querySelector('.bookmarked-text');
  let adjustment = 0;
  if (bookmarkedText) {
    adjustment = bookmarkedText.textContent.length;
  }

  // Adjust the calculation of the index and offsets


  const anchorOffset = selection.anchorOffset - (selection.anchorNode === bookmarkedText ? adjustment : 0);
  const focusOffset = selection.focusOffset - (selection.focusNode === bookmarkedText ? adjustment : 0);

  // Return the recalculated selection data
  return {
    anchorNodeIndex,
    focusNodeIndex,
    anchorOffset,
    focusOffset
  };*/
}