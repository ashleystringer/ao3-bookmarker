const tooltip = (actionType) => {
  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");
  const btn = document.createElement("button");

  btn.innerText = actionType === "add-bookmark" ? "Add Bookmark" : "Remove Bookmark";

  if(!btn.hasClickListener){
    btn.addEventListener("click", e => {
      console.log("Button test");

      if(actionType === "add-bookmark"){
        addBookmark(e);
      }else{
        removeBookmark(e);
      }
    });
    btn.hasClickListener = true;
  }

  tooltip.appendChild(btn);

  return tooltip;
}

const handleTextSelection = () => { 
  const selectionObject = document.getSelection();
  const anchorNode = selectionObject.anchorNode;
  const focusNode = selectionObject.focusNode;

  console.log(selectionObject);
  const tooltipElement = tooltip("add-bookmark");

  const range = document.createRange();

  const commonAncestorNode = selectionObject.getRangeAt(0).commonAncestorContainer;
  console.log(commonAncestorNode.contains(focusNode));

  if(commonAncestorNode.nodeName === "P" || commonAncestorNode.contains(anchorNode) && commonAncestorNode.contains(focusNode)){
  
    //ISSUE - I NEED TO MAKE THIS WORK FOR CHROME STORAGE
    if(selectionObject.anchorOffset < selectionObject.focusOffset){
      range.setStart(selectionObject.anchorNode, selectionObject.anchorOffset);
      range.setEnd(selectionObject.focusNode, selectionObject.focusOffset);
    }else{
      range.setStart(selectionObject.focusNode, selectionObject.focusOffset);
      range.setEnd(selectionObject.anchorNode, selectionObject.anchorOffset);
    }
    //
  
    if(!range.collapsed){
      console.log("range not collapsed");
      const spanElement = document.createElement("span");
      spanElement.className = "selectedText";
    
      spanElement.appendChild(range.extractContents());
  
      range.insertNode(spanElement);
      range.insertNode(tooltipElement); //tooltip created in other method
    }
  }

};

const handleBookmarkSelection = (e) => {
  console.log("handleBookmarkSelection");

  const tooltipElement = tooltip("remove-bookmark");

  const bookmarkedElement = e.target;
  bookmarkedElement.appendChild(tooltipElement);
}

const addBookmark = (e) => {
  const selectionObject = document.getSelection();
  const text = document.querySelector(".selectedText");
  text.classList.remove("selectedText");
  text.classList.add("bookmarker");
  console.log(text);

  console.log(selectionObject.anchorNode);
  console.log(selectionObject.focusNode);

  text.addEventListener("click", e => { handleBookmarkSelection(e) });

  const parentNode = text.parentNode;
  const parentClass = text.parentNode.className;
  const tooltip = document.querySelector(`.${parentClass}`).querySelector(".tooltip");
  console.log(parentClass);
  console.log(tooltip);

  parentNode.removeChild(tooltip);

  const childNodesArray = Array.from(parentNode.childNodes);
  const anchorIndex = childNodesArray.indexOf(selectionObject.anchorNode);
  const focusIndex = childNodesArray.indexOf(selectionObject.focusNode);

  const bookmarkByPage = {
    page: window.location.href,
    parentClass: parentClass,
    anchorOffset: selectionObject.anchorOffset,
    anchorIndex: anchorIndex,
    focusOffset: selectionObject.focusOffset,
    focusIndex: focusIndex,
    bookmarkedText: text.textContent
  }

  chrome.storage.local.set({bookmarkByPage: bookmarkByPage});
  
}

const removeBookmark = (e) => {
 console.log("removeBookmark");
}

const removeBookmarkSpan = () => {

  const bookmarked = document.querySelector(".bookmarker");
  const bookmarkedText = bookmarked.textContent;

  const bookmarkedTextNode = document.createTextNode(bookmarkedText);
  
  const range = document.createRange();

  //range.selectNode(bookmarked); //?

  //ISSUE - I NEED TO FIND OUT HOW TO GET THE SELECTION OBJECT DATA

  /*
  if(selectionObject.anchorOffset < selectionObject.focusOffset){
    range.setStart(selectionObject.anchorNode, selectionObject.anchorOffset);
    range.setEnd(selectionObject.focusNode, selectionObject.focusOffset);
  }else{
    range.setStart(selectionObject.focusNode, selectionObject.focusOffset);
    range.setEnd(selectionObject.anchorNode, selectionObject.anchorOffset);
  }
  */

  
  range.insertNode(bookmarkedTextNode);

};

const displayBookmark = (bookmarkByPage) => {
  console.log("bookmarkByPage");

  const range = document.createRange();

  // Get the parent node of the selection
  const parentNode = document.querySelector(`.${bookmarkByPage.parentClass}`);

  // Get the first and last child elements within the selection
  const startElement = parentNode.childNodes[bookmarkByPage.anchorIndex];
  const endElement = parentNode.childNodes[bookmarkByPage.focusIndex];

  console.log(parentNode.childNodes[0]);
  console.log(bookmarkByPage.focusIndex);

  // Set the start and end of the range to include all child elements within the selection
  range.setStartBefore(startElement);
  range.setEndAfter(endElement);

  if(!range.collapsed){
    console.log("range not collapsed");
    const spanElement = document.createElement("span");
    spanElement.className = "bookmarker";
  
    spanElement.appendChild(range.extractContents());

    spanElement.addEventListener("click", e => {handleBookmarkSelection(e)})

    range.insertNode(spanElement);
  }
}

const addIds = () => {
  const chapter = document
    .querySelector("#workskin")
    .querySelector("#chapters");
  const userstuff = chapter.querySelector(".userstuff.module");
  console.log(userstuff);

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

const removeIds = () => {
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
  console.log(userstuff);
};

const checkIfBookmarkExists = async () => {
  const { bookmarkByPage } = await chrome.storage.local.get("bookmarkByPage");
  console.log("bookmarkByPage");
  if(bookmarkByPage){
    //display the bookmark
    displayBookmark(bookmarkByPage);
  }
}

addIds();
checkIfBookmarkExists();

const chapter = document.querySelector("#workskin").querySelector("#chapters");
chapter.addEventListener("click", e => {
  console.log("workskin");
  handleTextSelection();
});