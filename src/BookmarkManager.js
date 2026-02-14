class BookmarkManager {
    constructor(tooltip, textSelector){
        this.tooltip = tooltip;
        this.textSelector = textSelector;
      }
    handleBookmarkedTextOption(targetElement, bookmarkedText, tooltipElement, isSelectionCollapsed) {
        // !!!! TEXT SELECTION !!!!
        if (!bookmarkedText.contains(targetElement) && tooltipElement && !tooltipElement.contains(targetElement)) {
          removeTooltip(bookmarkedText);
        } else if (!bookmarkedText.contains(targetElement) && !tooltipElement && !isSelectionCollapsed) {
          handleTextSelection("replace");
          }
        }
        async getBookmarkByChapter(){
            // !!!! BOOKMARK !!!!
            // !!!! STORAGE !!!!!
          
              const { bookmarks } = await chrome.storage.local.get("bookmarks");
              console.log(bookmarks);
          
              const { workNumber, pageChapterNumber } = getWorkDataFromURL(window.location.href);
              const bookmarkByPage = bookmarks[workNumber];
          
              console.log(bookmarkByPage);
              console.log(`bookmarkByPage.pageChapterNumber: ${bookmarkByPage.pageChapterNumber}`);
          
              if(bookmarkByPage && bookmarkByPage?.pageChapterNumber === pageChapterNumber){  
                displayBookmark(bookmarkByPage);
              }
            }
            displayBookmark(bookmarkByPage){
                // !!!! BOOKMARK !!!!
                // !!!! TEXT SELECTION !!!!
              
                console.log("displayBookmark");
                console.log(bookmarkByPage);
              
                // Get the parent node of the selection
                const parentNode = document.querySelector(modifiedParentClass(bookmarkByPage.parentClass));
                //const parentNode = document.querySelector(this.textSelector.modifiedParentClass(bookmarkByPage.parentClass));
              
              
                console.log(parentNode.childNodes);
              
                let anchorNode = parentNode.childNodes[bookmarkByPage.anchorNodeIndex]; //This assumes this is a text node.
                let focusNode = parentNode.childNodes[bookmarkByPage.focusNodeIndex]; //This assumes this is a text node.
              
                console.log(anchorNode); 
                if(anchorNode.nodeType === 1) anchorNode = getFirstTextNode(anchorNode); //anchorNode = anchorNode.firstChild;
                //if(anchorNode.nodeType === 1) anchorNode = this.textSelector.getFirstTextNode(anchorNode);
                console.log("anchorNode"); 
                console.log(anchorNode); 
              
              
                if(focusNode.nodeType === 1) focusNode = getFirstTextNode(focusNode); //focusNode = focusNode.firstChild;
                //if(anchorNode.nodeType === 1) focusNode = this.textSelector.getFirstTextNode(anchorNode);
                //if the anchor or focus node is an element node, get the first child of that element node
              
                console.log(anchorNode.nodeType, focusNode.nodeType);
              
                const anchorOffset = bookmarkByPage.anchorOffset;
                const focusOffset = bookmarkByPage.focusOffset;
              
                console.log(`anchorOffset: ${anchorOffset}, focusOffset: ${focusOffset}`);
                
                const range = modifiedRange({ anchorNode, anchorOffset, focusNode, focusOffset }, bookmarkByPage);
                //const range = this.textSelector.modifiedRange({ anchorNode, anchorOffset, focusNode, focusOffset }, bookmarkByPage);
              
                if(!range.collapsed){
                  console.log("range not collapsed");
                  const markElement = document.createElement("mark");
                  markElement.className = "bookmarkedText";
                
                  markElement.appendChild(range.extractContents());
              
                  markElement.addEventListener("click", e => {handleBookmarkSelection(e)})
              
                  range.insertNode(markElement);
                }
              }
            handleBookmarkSelection(e){
                // !!!! TEXT SELECTION !!!!
                // !!!! TOOLTIP !!!!
              
                // ADD TOOLTIP TO REMOVE BOOKMARK
              
                const tooltipElement = document.querySelector(".tooltip");
              
                if(tooltipElement == null){
              
                  const bookmarkedElement = e.target.closest(".bookmarkedText");
                  const bookmarkedElementRect = bookmarkedElement.getBoundingClientRect();
              
                  const newTooltipElement = createPositionedTooltip(bookmarkedElementRect, "delete");
                  //this.tooltip.createPositionedTooltop(bookmarkedElementRect, "delete");

                  document.body.appendChild(newTooltipElement); 
                }
              }
            replaceBookmark(selectionObject){ 
                // !!!! BOOKMARK !!!! 
                removeBookmark();
                addBookmark(selectionObject);
              }
            removeBookmark(e){
                // !!!! BOOKMARK !!!!
                // !!!! TOOLTIP !!!!
                // !!!! STORAGE !!!!
              
                const bookmarkedElement = document.querySelector(".bookmarkedText");
                removeMarkElement(bookmarkedElement);
              
                removeTooltip();
                
                // REMOVING THE BOOKMARK FROM LOCAL STORAGE
                chrome.storage.local.get("bookmarks", (result) => {
                  const { workNumber } = getWorkDataFromURL(window.location.href);
              
                  let bookmarks = result.bookmarks || {};
              
                  delete bookmarks[workNumber];
              
                  chrome.storage.local.set(result);
                });
              
              }
              async addBookmark(selectionObject){

                // !!!! BOOKMARK !!!!
                // !!!! TOOLTIP !!!!
                // !!!! STORAGE !!!!
              
                console.log("addBookmark");
              
                let bookmarkByPage = await applyBookmarkedText(selectionObject);
                const workNumber = bookmarkByPage.workNumber;
              
                const bookmarkedText = document.querySelector(".bookmarkedText");
              
                const parentClass = bookmarkedText.parentNode.closest('P').className; //selectedText.parentNode.className;
              
                bookmarkByPage.parentClass = parentClass;
              
                removeTooltip();
                
              
                // GETTING THE WORK NUMBER AND CHAPTER NUMBER FROM THE URL TO PUT INTO LOCAL STORAGE
              
                chrome.storage.local.get("bookmarks", (result) => {
                  let bookmarks = result.bookmarks || {};
              
                  bookmarks[workNumber] = bookmarkByPage;
                
                  chrome.storage.local.set({ bookmarks: bookmarks });
                });
              }
              async applyBookmarkedText(selectionObject){

                // !!!! TEXT SELECTION !!!!
                // !!!! BOOKMARK !!!!
              
                const { 
                  anchorOffset,
                  anchorNodeIndex,
                  focusOffset,
                  focusNodeIndex
                } = await calculateSelectionData(selectionObject);
              
                console.log(`anchorOffset: ${anchorOffset}, anchorNodeIndex: ${anchorNodeIndex}, focusOffset: ${focusOffset}, focusNodeIndex: ${focusNodeIndex}`);
              
                const anchorNode = selectionObject.anchorNode;
                const focusNode = selectionObject.focusNode;
              
                const commonAncestorNode = selectionObject.getRangeAt(0).commonAncestorContainer;
                if(commonAncestorNode.nodeName === "P" || commonAncestorNode.contains(anchorNode) && commonAncestorNode.contains(focusNode)){
              
                  //if anchorNode and focusNode are nodes other than text nodes
              
                  let range;
                  if(anchorOffset === selectionObject.anchorOffset && focusOffset === selectionObject.focusOffset){
                    range = modifiedRange({ anchorNode, anchorOffset, focusNode, focusOffset }, selectionObject);
                    //range = this.textSelector.modifiedRange(({ anchorNode, anchorOffset, focusNode, focusOffset }, selectionObject));
                  }else{
                    const originalAnchorOffset = selectionObject.anchorOffset;
                    const originalFocusOffset = selectionObject.focusOffset;
              
                    range = modifiedRange({ anchorNode, anchorOffset: originalAnchorOffset, focusNode, focusOffset: originalFocusOffset }, selectionObject);
                    //range = this.textSelector.modifiedRange(({ anchorNode, anchorOffset, focusNode, focusOffset }, selectionObject));
                  }
              
                  const anchorParagraph = anchorNode.parentNode.nodeName === 'P' ? anchorNode.parentNode : anchorNode.parentNode.closest('P');
                  const focusParagraph = focusNode.parentNode.nodeName === 'P' ? focusNode.parentNode : focusNode.parentNode.closest('P');
                
                  if (anchorParagraph !== focusParagraph) return;
              
                  if(!range.collapsed){
                    console.log("range not collapsed");
              
                    const markElement = document.createElement("mark");
                    markElement.className = "bookmarkedText";
                  
                    markElement.appendChild(range.extractContents());
                    markElement.addEventListener("click", e => { handleBookmarkSelection(e) });
                
                    range.insertNode(markElement);
                  }
              
                const { workNumber, urlChapterNumber, pageChapterNumber } = getWorkDataFromURL(window.location.href);
              
              
                const authorName = document.querySelector(".byline").querySelector("a").textContent;
                const workTitle = document.querySelector(".title").textContent;
              
              
                console.log("commonAncestorNode.nodeName");
                console.log(commonAncestorNode.nodeName);
              
                const selectedTextByPage = {
                  authorName,
                  workTitle,
                  workNumber,
                  workURL: window.location.href,
                  urlChapterNumber,
                  pageChapterNumber,
                  anchorOffset, //recreated anchorOffset 
                  anchorNodeIndex, //recreated anchorNodeIndex
                  anchorNodeClass: anchorNode.parentNode.className,
                  focusOffset, //recreated focusOffset
                  focusNodeIndex, //recreated focusNodeIndex
                  focusNodeClass: focusNode.parentNode.className,
                  //parentClass: commonAncestorNode.className //
                  //bookmarkedText: selectedText.textContent
                }
              
                return selectedTextByPage;
                }
              }
            async calculateSelectionData(selection) {
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
}

/*
Initial idea for point of truth

const tooltip = new Tooltip();
const textSelector = new TextSelector(tooltip);
const bookmarkManager = new BookmarkManager(tooltip, textSelector);

*/