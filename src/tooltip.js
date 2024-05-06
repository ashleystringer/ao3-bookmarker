
export const createTooltip = (buttonMsg, callback) => {
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

export const removeTooltip = (parentElement) => {
  const tooltip = parentElement.querySelector(".tooltip");
  if(tooltip == null) return;
  parentElement.removeChild(tooltip);
}

export const findTooltipLocation = (element, tooltip) => {
  
  if (isTooltipUnderViewport(element)){
    tooltip.style.top = `${element.getBoundingClientRect().bottom}px`; //`-120%`
    tooltip.classList.remove("default");
    tooltip.classList.add("tooltip", "dropdown");
  }else{
    tooltip.style.bottom = `120%`;
    tooltip.classList.add("tooltip", "default");
  }

}

function isTooltipUnderViewport(element){
  const rect = element.getBoundingClientRect();
  if (rect.top <= 55) return true;
}