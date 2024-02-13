/*
Requirements for the tooltip
- Needs to have two buttons 
  - One to add or delete a bookmark
    - One icon to add a bookmark
    - One icon to delete a bookmark
    - One icon to replace a bookmark
  - Copy the selected text
*/

/*
  //create tooltip and add it onto the DOM element
  //
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

export const removeTooltip = (parentElement) => {
  const tooltip = parentElement.querySelector(".tooltip");
  if(tooltip == null) return;
  parentElement.removeChild(tooltip);
}

const changeTooltipLocation = () => {
  //Take the location of either the tooltip or the selected or bookmarked text
  //using getBoundingClientRect() on the element
  //compare the location of the element to window.innerHeight and/or window.innerWidth
  //change the location of the tooltip based on this comparison
}