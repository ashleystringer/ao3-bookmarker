/*
- Finish the tooltip and changeTooltipLocation methods.
*/


export const createTooltip = (buttonMsg, callback) => {
  // CREATES TOOLTIP DIV
  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip", "faded-out");
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

export const tooltip = (buttonMsg, callback, parentElement) => {
  const tooltip = createTooltip(buttonMsg, callback);
  findTooltipLocation(parentElement, tooltip); //change name of this function
  return tooltip;
}

export const removeTooltip = (parentElement) => {
  const tooltip = parentElement.querySelector(".tooltip");
  if(tooltip == null) return;
  parentElement.removeChild(tooltip);
}

export const findTooltipLocation = (element, tooltip) => {

  console.log(element);

  console.log(tooltip["after"]);

  //isTooltipUnderViewport(element);

  //tooltip.style.left = `${element.getBoundingClientRect().left}px`;

  if (isTooltipUnderViewport(element)){
    tooltip.style.top = `${element.getBoundingClientRect().bottom}px`; //`-120%`
    tooltip["after"].style.top = 0;
  }else{
    tooltip.style.bottom = `120%`;
    tooltip["after"].style.top = `100%`;
  
  }

}

function isTooltipUnderViewport(element){
  const rect = element.getBoundingClientRect();
  if (rect.top <= 55) return true;
}