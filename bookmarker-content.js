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


  if (anchorNode.parentNode === focusNode.parentNode) {
    
    insertBookmarkSpan(selectionObject, anchorNode.parentNode);

  }
};

const insertBookmarkSpan = (selectionObject, parentNode) => {
  const parentHTML = parentNode.innerHTML;
  console.log(parentHTML);

  const range = document.createRange();
  range.setStart(selectionObject.anchorNode, selectionObject.anchorOffset);
  range.setEnd(selectionObject.focusNode, selectionObject.focusOffset);

  const spanElement = document.createElement("span");
  spanElement.className = "bookmarker";

  spanElement.appendChild(range.extractContents());
  range.insertNode(spanElement);
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
  bookmarker();
});
