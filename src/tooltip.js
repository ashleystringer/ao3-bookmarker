/*
- Finish the tooltip and changeTooltipLocation methods.
- Add JavaScript to properly center the tooltip relative to the selected or bookmarked text.
*/


export const createTooltip = (buttonMsg, callback) => {
  // CREATES TOOLTIP DIV
  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");
  //

  // CREATES BUTTON DIV
  const btnDiv = document.createElement("button");
  btnDiv.classList.add("btn");

  btnDiv.innerText = buttonMsg;
  //

  // ADDS EVENT LISTENER TO BUTTON DIV
  if(!btnDiv.hasClickListener){
    btnDiv.addEventListener("click", e => {
      e.stopPropagation();
      console.log("Button test");

      callback(e);

    });
    btnDiv.hasClickListener = true;
  }
  //

  tooltip.appendChild(btnDiv);

  return tooltip;
}

export const tooltip = (buttonMsg, callback, parentElement) => {
  const tooltip = createTooltip(buttonMsg, callback);
  changeTooltipLocation(parentElement, tooltip); //change name of this function
  return tooltip;
}

export const removeTooltip = (parentElement) => {
  const tooltip = parentElement.querySelector(".tooltip");
  if(tooltip == null) return;
  parentElement.removeChild(tooltip);
}

const changeTooltipLocation = (element, tooltip) => {

  isTooltipUnderViewport(element);

  tooltip.style.left = `${element.getBoundingClientRect().left}px`;

  if (isTooltipUnderViewport(element)){
    tooltip.style.top = `${element.getBoundingClientRect().bottom}px`; //`-120%`
    tooltip["after"].style.top = 0;
  }else{
    tooltip.style.bottom = `120%`;
    tooltip["after"].style.top = `100%`;
  
  }

}

export function isTooltipUnderViewport(element){
  const rect = element.getBoundingClientRect();
  if (rect.top <= 55) return true;
}