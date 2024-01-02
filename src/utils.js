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
      const chapterNumber = match[2];
  
      return { workNumber, chapterNumber };
    }
  
    return null;
  }