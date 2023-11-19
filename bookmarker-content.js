const tooltip = () => {
  const selectionObject = document.getSelection();
  console.log(selectionObject);

  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");
  const btn = document.createElement("button");
  btn.innerText = "Add Bookmark";
  btn.addEventListener("click", e => {
    console.log("Button test");
  });
  tooltip.appendChild(btn);

  const range = document.createRange();


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
    range.insertNode(tooltip);
  }
};

const bookmarker = () => {
  const selectionObject = document.getSelection();

  const anchorNode = selectionObject.anchorNode;
  const anchorOffset = selectionObject.anchorOffset;
  const focusNode = selectionObject.focusNode;
  const focusOffset = selectionObject.focusOffset;

  const parentNode = anchorNode.parentNode.innerText;

  console.log(selectionObject);
  console.log(parentNode);
  console.log(parentNode.length);
  console.log(anchorNode.parentNode);
  console.log(focusNode.parentNode);
  console.log(anchorNode);
  console.log(focusNode);

  const commonAncestorNode = selectionObject.getRangeAt(0).commonAncestorContainer;
  console.log(commonAncestorNode.contains(focusNode));

  if(commonAncestorNode.nodeName === "P" || commonAncestorNode.contains(anchorNode) && commonAncestorNode.contains(focusNode)){
    insertBookmarkSpan(selectionObject);
  }

};

const insertBookmarkSpan = (selectionObject) => {
  const range = document.createRange();

  console.log(selectionObject.anchorOffset);
  console.log(selectionObject.focusOffset);

  console.log(selectionObject.toString());

  
  const selectionContent = {
    anchorNode: selectionObject.anchorNode.textContent,
    anchorOffset: selectionObject.anchorOffset,
    focusNode: selectionObject.focusNode.textContent,
    focusOffset: selectionObject.focusOffset,
    toString: selectionObject.toString()
  };
  
  //chrome.storage.local.set({bookmarkedTextByPage: selectionContent});

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
    spanElement.className = "bookmarker";
  
    spanElement.appendChild(range.extractContents());

    range.insertNode(spanElement);
  }

};

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

  
  range.insertNode(bookmarkedTextNode)
  

};

const addIds = () => {
  const chapter = document
    .querySelector("#workskin")
    .querySelector("#chapters");
  const userstuff = chapter.querySelector(".userstuff.module");
  console.log(userstuff);

  userstuff.childNodes.forEach((child, index) => {
    /*console.log(`child.nodeName: ${child.nodeName}, 
    number of child nodes: ${child.childNodes.length} 
    index: ${index}`);*/
    if (child.nodeName !== "#text") {
      /*console.log(`child.nodeName: ${child.nodeName}, 
      number of child nodes: ${child.childNodes.length} 
      index: ${index}`);*/
      child.classList.add(`${child.nodeName}-${index}`);
      if (child.childNodes.length !== 0) {
        const childNodes = child.childNodes;
        let childIndex = 0;
        childNodes.forEach(childNode => {
          if (childNode.nodeName !== "#text") {
            //console.log(`child.nodeName: ${childNode.nodeName}`);
            //console.log(childNode);
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
    /*console.log(`child.nodeName: ${child.nodeName}, 
    number of child nodes: ${child.childNodes.length} 
    index: ${index}`);*/
    if (child.nodeName !== "#text") {
      /*console.log(`child.nodeName: ${child.nodeName}, 
      number of child nodes: ${child.childNodes.length} 
      index: ${index}`);*/
      child.classList.remove(`${child.nodeName}-${index}`);
      if (child.childNodes.length !== 0) {
        const childNodes = child.childNodes;
        let childIndex = 0;
        childNodes.forEach(childNode => {
          if (childNode.nodeName !== "#text") {
            //console.log(`child.nodeName: ${childNode.nodeName}`);
            //console.log(childNode);
            childIndex++;
            childNode.classList.remove(`${childNode.nodeName}-${childIndex}`);
          }
        });
      }
    }
  });
  console.log(userstuff);
};

addIds();

const chapter = document.querySelector("#workskin").querySelector("#chapters");
chapter.addEventListener("click", e => {
  console.log("workskin");
  tooltip();
  bookmarker();
});
