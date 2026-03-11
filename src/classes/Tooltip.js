class Tooltip{
      constructor(){
        
      }
      createTooltip(buttonMsg, callback){ //COPIED
        // CREATES TOOLTIP DIV
        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip", "default", "faded-out");
        //
      
        requestAnimationFrame(() => {
          tooltip.classList.remove("faded-out");
        });
      
        // CREATES BUTTON DIV
        const btnDiv = document.createElement("button");
        btnDiv.classList.add("btn");
      
        btnDiv.innerText = buttonMsg;
        //
      
        // ADDS EVENT LISTENER TO BUTTON DIV
        if(!btnDiv.hasClickListener){
          btnDiv.addEventListener("click", e => {
            e.stopPropagation();
      
            callback(e);
          });
          btnDiv.hasClickListener = true;
        }
        //
      
        tooltip.appendChild(btnDiv);
      
        return tooltip;
      }
      
      removeTooltip(parentElement){ //COPIED
        //**** THIS IS IN PROGRESS ****
      
        const tooltip = document.body.querySelector(".tooltip");
        if(tooltip == null) return;
        document.body.removeChild(tooltip);
      }
      
      findTooltipLocation(elementRect, tooltip){ //COPIED
      
          //**** THIS IS IN PROGRESS ****
        if (isTooltipUnderViewport(elementRect)){
          tooltip.style.top = elementRect.bottom + window.scrollY + "px";
          tooltip.style.left = (elementRect.left + elementRect.right) / 2 + "px";
          tooltip.classList.remove("default");
          tooltip.classList.add("tooltip", "dropdown");
        }else{
          tooltip.style.top = elementRect.top + window.scrollY - 80 + "px";
          tooltip.style.left = (elementRect.left + elementRect.right) / 2 + "px";
          tooltip.classList.add("tooltip", "default");
        }
      
      }
      
      isTooltipUnderViewport(elementRect){ //COPIED
        //const rect = element.getBoundingClientRect();
        if (elementRect.top <= 55) return true;
      }
}