export class TextSelector {
    constructor(tooltip){
        this.tooltip = tooltip; 
        }
      
      handleSelectedTextOption(tooltipElement) {
          // !!!! TOOLTIP !!!! 
          // !!!! TEXT SELECTION !!!!
  
          tooltipElement ? removeTooltip() : handleTextSelection("add");
        }  
    async handleTextSelection (tooltipType) {
            // !!!! TEXT SELECTION !!!!
            // !!!! TOOLTIP !!!!
    
            const selectionObject = document.getSelection();
            const selectionObjectRect = document.getSelection().getRangeAt(0).getBoundingClientRect();
    
    
            const anchorNode = selectionObject.anchorNode;
            const focusNode = selectionObject.focusNode;
    
            const anchorParagraph = this.getParentParagraph(anchorNode);
            const focusParagraph = this.getParentParagraph(focusNode);

            if (anchorParagraph !== focusParagraph) return;
    
            this.tooltip.createPositionedTooltip(selectionObjectRect, tooltipType, selectionObject);
    
            document.body.appendChild(tooltip); 
    } 
        getFirstTextNode(node){ //- Save for utils.js?
            // !!!! TEXT SELECTION !!!!
    
            if(node.nodeType === Node.TEXT_NODE && node.nodeValue !== '\n'  && node.nodeValue !== '&nbsp;') return node; 
    
            let result = null;
            for (let i = 0; i < node.childNodes.length && result === null; i++) {
            result = getFirstTextNode(node.childNodes[i]);
            }
            return result;
        }
        modifiedRange({ anchorNode, anchorOffset, focusNode, focusOffset }, selectionObject){
            // !!!! TEXT SLECTION !!!!
      
            const range = document.createRange();
      
            if((anchorNode === focusNode) && (selectionObject.anchorOffset < selectionObject.focusOffset)){
              range.setStart(anchorNode, anchorOffset);
              range.setEnd(focusNode, focusOffset);
            }else if((anchorNode === focusNode) && (selectionObject.anchorOffset >= selectionObject.focusOffset)){      
              range.setStart(focusNode, focusOffset);
              range.setEnd(anchorNode, anchorOffset);
            }
      
            console.log(anchorNode);
      
            if((anchorNode !== focusNode) && (anchorNode.compareDocumentPosition(focusNode) & Node.DOCUMENT_POSITION_FOLLOWING)){
              range.setStart(anchorNode, anchorOffset);
              range.setEnd(focusNode, focusOffset);
            }else if((anchorNode !== focusNode) && !(anchorNode.compareDocumentPosition(focusNode) & Node.DOCUMENT_POSITION_FOLLOWING)){
              range.setStart(focusNode, focusOffset);
              range.setEnd(anchorNode, anchorOffset);
            }
      
            return range;
        }
        modifiedParentClass(parentClassStr){ //- Save for util.js
            // !!!! TEXT SELECTION !!!!
      
            const parentClassArray = parentClassStr.split(" ");
            const newArray = parentClassArray.map(parentClass => `.${parentClass}`);
      
            return newArray.join("");
          }
        getParentParagraph(node){
          //const anchorParagraph = anchorNode.parentNode.nodeName === 'P' ? anchorNode.parentNode : anchorNode.parentNode.closest('P');
          return node.parentNode.nodeName === 'P' ? node.parentNode : node.parentNode.closest('P');
        }
  }
    //handleSelectedTextOption - needs tooltip - PASTED
    //???? handleBookmarkedTextOption - needs tooltip
    //handleTextSelection - needs tooltip - PASTED
    //getFirstTextNode - PASTED //- save for utils.js
    //modifiedRange - PASTED
    //modifiedParentClass - PASTED //- save for utils.js?


    //~~ functions in utils.js ~~

    //addIds
    //removeIds
    //getWorkDataFromURL ????
    //getChapterNumber
    //getNodeIndex
  