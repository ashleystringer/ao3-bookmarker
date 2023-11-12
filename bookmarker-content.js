/*
  - Is the selected object a paragraph?
  - Is the selected object part of a paragraph?
*/

const bookmarker = () => {
  const selectionObject = document.getSelection();

  const anchorNode = selectionObject.anchorNode;
  const anchorOffset = selectionObject.anchorOffset;
  const focusNode = selectionObject.focusNode;
  const focusOffset = selectionObject.focusOffset;

  const parentNode = anchorNode.parentNode.innerText;

  console.log(parentNode);
  console.log(parentNode.length);
  /*
    - Do the anchorNode and focusNode have the same parent element?
    - Do the anchorNode and focusNode have the same sibling element?
  */

  if (anchorNode.parentNode === focusNode.parentNode) {
    //do something
    //anchorNode?.nextSibling === focusNode?.nextSibling
    const parentNode = anchorNode.parentNode;
    if (parentNode.childNodes.length == 1) {
      console.log("Single element");
      //place the smallest number in the first index
      //place the largest number in the second index
    } else {
      const parentNode = anchorNode.parentNode;
      parentNode.childNodes.forEach(child => {
        console.log(child);
        /*
          - find the total length of each child node's inner text
          - determine which child nodes are affected by the selection object's location
          - find the absolute position of the selection object
        */
      });
    }
  }
};

const findSelectionLocation = selectionObject => {
  /*

  */
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
    console.log(`child.nodeName: ${child.nodeName}, 
    number of child nodes: ${child.childNodes.length} 
    index: ${index}`);
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
  //bookmarker();
});
