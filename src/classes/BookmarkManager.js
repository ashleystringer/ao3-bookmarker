import { getNodeIndex, getWorkDataFromURL, removeMarkElement, createPositionedTooltip, test } from '../utils.js'
import StorageManager  from "./StorageManager";

export default class BookmarkManager {
    constructor(tooltip, textSelector){
        this.tooltip = tooltip;
        this.textSelector = textSelector;
        this.storageManager = new StorageManager();
      }
    handleBookmarkedTextOption(targetElement, bookmarkedText, tooltipElement, isSelectionCollapsed) {
        // !!!! TEXT SELECTION !!!!

        console.log("handleBookmarkedTextOption");

        if (!bookmarkedText.contains(targetElement) && tooltipElement && !tooltipElement.contains(targetElement)) {
          this.tooltip.removeTooltip(bookmarkedText);
        } else if (!bookmarkedText.contains(targetElement) && !tooltipElement && !isSelectionCollapsed) {
          console.log("else if");

          test(this.textSelector, this.tooltip, "replace", (data) => this.replaceBookmark(data))
          }
        }
    async getBookmarkByChapter(){
        // !!!! BOOKMARK !!!!
        // !!!! STORAGE !!!!!
        const { bookmarkByPage, pageChapterNumber } = await this.storageManager.getBookmark();
          
        console.log(bookmarkByPage);
        console.log(`bookmarkByPage.pageChapterNumber: ${bookmarkByPage.pageChapterNumber}`);
          
        if(bookmarkByPage && bookmarkByPage?.pageChapterNumber === pageChapterNumber){  
          this.displayBookmark(bookmarkByPage);
          }
      }
    displayBookmark(bookmarkByPage){
      // !!!! BOOKMARK !!!!
      // !!!! TEXT SELECTION !!!!
              
      console.log("bookmarkByPage in displayBookmark");
      console.log(bookmarkByPage);
      // Get the parent node of the selection
      const parentNode = document.querySelector(this.textSelector.modifiedParentClass(bookmarkByPage.parentClass));              
                            
      let anchorNode = parentNode.childNodes[bookmarkByPage.anchorNodeIndex]; //This assumes this is a text node.
      let focusNode = parentNode.childNodes[bookmarkByPage.focusNodeIndex]; //This assumes this is a text node.
              
      if(anchorNode.nodeType === 1) anchorNode = this.textSelector.getFirstTextNode(anchorNode); //anchorNode = anchorNode.firstChild;
              
      if(focusNode.nodeType === 1) focusNode = this.textSelector.getFirstTextNode(focusNode); //focusNode = focusNode.firstChild;
      //if the anchor or focus node is an element node, get the first child of that element node
                            
      const anchorOffset = bookmarkByPage.anchorOffset;
      const focusOffset = bookmarkByPage.focusOffset;
              
      console.log(`anchorOffset: ${anchorOffset}, focusOffset: ${focusOffset}`);
                
      const range = this.textSelector.modifiedRange({ anchorNode, anchorOffset, focusNode, focusOffset }, bookmarkByPage);
              
      if(!range.collapsed){
        console.log("range not collapsed");
        this.createBookmarkElement(range, (e) => this.handleBookmarkSelection(e));
        }
      }
      
    handleBookmarkSelection(e){

      //STOPPING RIGHT HERE

      // !!!! TEXT SELECTION !!!!
      // !!!! TOOLTIP !!!!
                  
      const tooltipElement = document.querySelector(".tooltip");

      console.log('handleBookmarkSelection method in BookmarkManager');
              
      if(tooltipElement == null){
              
        const bookmarkedElement = e.target.closest(".bookmarkedText");
        const bookmarkedElementRect = bookmarkedElement.getBoundingClientRect();
              
        //const newTooltipElement = createPositionedTooltip(bookmarkedElementRect, "delete"); // !!!! FIX THIS NEXT TIME !!!!

        const newTooltipElement = createPositionedTooltip({ selectionObjectRect: bookmarkedElementRect }, this.tooltip, "delete", () => this.removeBookmark());

        document.body.appendChild(newTooltipElement); 
        }
    }
    replaceBookmark(selectionObject){ 
      // !!!! BOOKMARK !!!! 
      this.removeBookmark();
      this.addBookmark(selectionObject);
    }
    removeBookmark(e){
      // !!!! BOOKMARK !!!!
      // !!!! TOOLTIP !!!!
      // !!!! STORAGE !!!!

      console.log("removeBookmark");
              
      const bookmarkedElement = document.querySelector(".bookmarkedText");
      removeMarkElement(bookmarkedElement);
              
      this.tooltip.removeTooltip();

      // REMOVING THE BOOKMARK FROM LOCAL STORAGE
      
      const { workNumber } = getWorkDataFromURL(window.location.href);
      this.storageManager.remove(workNumber);  
    }
    async addBookmark(selectionObject){

    // !!!! BOOKMARK !!!!
    // !!!! TOOLTIP !!!!
    // !!!! STORAGE !!!!

    console.log("selectionObject in addBookmark");
    console.log(selectionObject);
              
    let bookmarkByPage = await this.applyBookmarkedText(selectionObject);
    const workNumber = bookmarkByPage.workNumber;
              
    const bookmarkedText = document.querySelector(".bookmarkedText");
              
    const parentClass = bookmarkedText.parentNode.closest('P').className; //selectedText.parentNode.className;
              
    bookmarkByPage.parentClass = parentClass;
              
    this.tooltip.removeTooltip();           
              
    // GETTING THE WORK NUMBER AND CHAPTER NUMBER FROM THE URL TO PUT INTO LOCAL STORAGE
              
    this.storageManager.set(workNumber, bookmarkByPage);

    console.log("end of addBookmark");
    }

    async applyBookmarkedText(selectionObject){

      // !!!! TEXT SELECTION !!!!
      // !!!! BOOKMARK !!!!
      const { 
        anchorOffset,
        anchorNodeIndex,
        focusOffset,
        focusNodeIndex
        } = await this.calculateSelectionData(selectionObject);
              
        console.log(`anchorOffset: ${anchorOffset}, anchorNodeIndex: ${anchorNodeIndex}, focusOffset: ${focusOffset}, focusNodeIndex: ${focusNodeIndex}`);
              
        const anchorNode = selectionObject.anchorNode;
        const focusNode = selectionObject.focusNode;
                
        const commonAncestorNode = selectionObject.range.commonAncestorContainer;

        console.log("selectionObject.range");
        console.log(selectionObject.range);
        console.log("commonAncestorNode.contains(anchorNode)");
        console.log(commonAncestorNode.contains(selectionObject.anchorNode));
        console.log("commonAncestorNode.contains(focusNode)");
        console.log(commonAncestorNode.contains(selectionObject.focusNode));

        if(commonAncestorNode.nodeName === "P" || commonAncestorNode.contains(anchorNode) && commonAncestorNode.contains(focusNode)){
              
          //if anchorNode and focusNode are nodes other than text nodes
              
          let range;
          if(anchorOffset === selectionObject.anchorOffset && focusOffset === selectionObject.focusOffset){
              range = this.textSelector.modifiedRange({ anchorNode, anchorOffset, focusNode, focusOffset }, selectionObject);
          }else{
            const originalAnchorOffset = selectionObject.anchorOffset;
            const originalFocusOffset = selectionObject.focusOffset;
              
            range = this.textSelector.modifiedRange({ anchorNode, anchorOffset: originalAnchorOffset, focusNode, focusOffset: originalFocusOffset }, selectionObject);
          }
              
          const anchorParagraph = anchorNode.parentNode.nodeName === 'P' ? anchorNode.parentNode : anchorNode.parentNode.closest('P');
          const focusParagraph = focusNode.parentNode.nodeName === 'P' ? focusNode.parentNode : focusNode.parentNode.closest('P');
                
          if (anchorParagraph !== focusParagraph) return;
              
          if(!range.collapsed){
            console.log("range not collapsed");

            this.createBookmarkElement(range, (e) => this.handleBookmarkSelection(e)); //this.createBookmarkElement(range, this.handleBookmarkSelection);
            }
             
            console.log("before workNumber");
            const { workNumber, urlChapterNumber, pageChapterNumber } = getWorkDataFromURL(window.location.href);
              
            const authorName = document.querySelector(".byline").querySelector("a").textContent;
            const workTitle = document.querySelector(".title").textContent;  
              
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
            }
              
            return selectedTextByPage;
            }

            console.log("after giant if statement");
    }
    async calculateSelectionData(selection) {

            console.log("calculateSelectionData");

            const bookmarkedText = document.querySelector(".bookmarkedText");
              
            console.log(selection.range.startContainer.parentNode);
            let anchorNodeIndex = getNodeIndex(selection.range.startContainer); //selection.anchorNode
            let focusNodeIndex = getNodeIndex(selection.range.endContainer); //selection.focusNode
                
            const shouldRecalculate = (bookmarkedText !== null) 
              && (bookmarkedText.closest("P") === selection.anchorNode.parentNode.closest('P'))
              && !(selection.focusNode.compareDocumentPosition(bookmarkedText) & Node.DOCUMENT_POSITION_FOLLOWING);


            if (!shouldRecalculate){
              return {
                anchorNodeIndex: anchorNodeIndex, //getNodeIndex(selection.anchorNode)
                anchorOffset: selection.anchorOffset,
                focusNodeIndex: focusNodeIndex, //getNodeIndex(selection.focusNode)
                focusOffset: selection.focusOffset
                };
              }
                
            await this.handleIndicesAfterBookmark(); //return object
    }

    async handleIndicesAfterBookmark(){ //handleIndicesPostBookmark

                console.log("handleIndicesAfterBookmark");

                const bookmarkedText = document.querySelector(".bookmarkedText"); //NEED TO REVISE THIS

                const { bookmarkByPage } = await this.storageManager.getBookmark();
                          
              if (selection.anchorNode.previousSibling !== bookmarkedText){
                this.calculateNonAdjacentNode(bookmarkByPage); //return object
              }

              this.calculateAdjacentNode(bookmarkByPage); //return object
    }

    calculateNonAdjacentNode(bookmarkByPage){

              const bookmarkedText = document.querySelector(".bookmarkedText"); //NEED TO REVISE THIS

              let recalculatedAnchorNodeIndex = 0;
              let recalculatedFocusNodeIndex = 0;
                          
              if (selection.anchorNode.previousSibling !== bookmarkedText){                
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
                distanceFromBookmark = focusNodeIndex - anchorNodeIndex; //focusNodeIndex - bookmarkedTextIndex
                recalculatedFocusNodeIndex = recalculatedAnchorNodeIndex + distanceFromBookmark;
                
                return {
                  anchorNodeIndex: recalculatedAnchorNodeIndex,
                  focusNodeIndex: recalculatedFocusNodeIndex,
                  anchorOffset: selection.anchorOffset,
                  focusOffset: selection.focusOffset
                };
            }
    }

    calculateAdjacentNode(bookmarkByPage){

            const bookmarkedText = document.querySelector(".bookmarkedText"); //NEED TO REVISE THIS
            const selectionAnchorOffset = selection.anchorOffset;
            const selectionFocusOffset = selection.focusOffset;

              let recalculatedAnchorOffset = -1;
              let recalculatedAnchorNodeIndex = 0;
              let recalculatedFocusOffset = -1;
              let recalculatedFocusNodeIndex = 0;

              recalculatedAnchorNodeIndex = bookmarkByPage.focusNodeIndex;
              recalculatedFocusNodeIndex = bookmarkByPage.focusNodeIndex + Math.abs(focusNodeIndex - anchorNodeIndex);
            
              if (bookmarkedText.childNodes.length === 1) {
                const bookmarkAnchorOffset = bookmarkByPage.anchorOffset;
                const bookmarkedTextLength = bookmarkedText.textContent.length;
            
                recalculatedAnchorOffset = bookmarkAnchorOffset + bookmarkedTextLength + selectionAnchorOffset;
                recalculatedFocusOffset = bookmarkAnchorOffset + bookmarkedTextLength + selectionFocusOffset;
              }else if (bookmarkedText.childNodes.length > 1){
                const lastChildOffset = bookmarkedText.lastChild.textContent.length;
            
                recalculatedAnchorOffset = lastChildOffset + selectionAnchorOffset;
                recalculatedFocusOffset = lastChildOffset + selectionFocusOffset;
              }
              return {
                anchorNodeIndex: recalculatedAnchorNodeIndex,
                focusNodeIndex: recalculatedFocusNodeIndex,
                anchorOffset: recalculatedAnchorOffset,
                focusOffset: recalculatedFocusOffset
              };
    }

    createBookmarkElement(range, callback){
            const markElement = document.createElement("mark");
            markElement.className = "bookmarkedText";
                
            markElement.appendChild(range.extractContents());
            markElement.addEventListener("click", e => {callback(e)})
              
            range.insertNode(markElement);
    }
}