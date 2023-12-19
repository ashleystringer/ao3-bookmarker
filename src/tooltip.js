/*export const tooltip = (actionType) => {
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
  
    const btnDiv = document.createElement("button");
    btnDiv.classList.add("btn");
  
    btnDiv.innerText = actionType === "add-bookmark" ? "+" : "-";
  
    if(!btnDiv.hasClickListener){
      btnDiv.addEventListener("click", e => {
        e.stopPropagation();
        console.log("Button test");
  
        if(actionType === "add-bookmark"){
          addBookmark(e);
        }else{
          removeBookmark(e);
        }
      });
      btnDiv.hasClickListener = true;
    }
  
    tooltip.appendChild(btnDiv);
  
    return tooltip;
  }*/


  export class Tooltip{
    constructor(){
      this.tooltip = this.createTooltip();
      this.actionType = null;
      this.message = null;
    }
    createTooltip(){
      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");

      return tooltip;
    }
    addActionType(actionType, button){
      button.addEventListener("click", e => {
        e.stopPropagation();
        actionType(e);
      });
    }
    addMessage(message){

    }
    addButton(buttonMessage, actionType){
      const button = document.createElement("button");
      button.classList.add("btn");
      button.innerText = buttonMessage;
      this.addActionType(actionType, button);
      this.tooltip.appendChild(button);
    }
  }

/*
function createTooltip(){
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");

    return tooltip;
}
function addActionTypeToButton(actionType, button){
    button.addEventListener("click", e => {
      e.stopPropagation();
      actionType(e);
    });
}
function addButtonToTooltip(ttoltip, buttonMessage, actionType){
    const button = document.createElement("button");
    button.classList.add("btn");
    button.innerText = buttonMessage;
    this.addActionType(actionType, button);
    this.tooltip.appendChild(button);
}
*/


  /*
const tooltip = () => {
  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");

  tooltip.innerText = "Do you want to delete previous bookmark?";

  const yesBtn = document.createElement("button");
  const noBtn = document.createElement("button");

  yesBtn.classList.add("btn");
  noBtn.classList.add("btn");

  yeBtn.innerText = "Yes";
  noBtn.innerText = "No";

  yesBtn.addEventListener("click", e => {
    e.stopPropagation();
    //remove previous bookmark
    //add new bookmark
  });

  noBtn.addEventListener("click", e => {
    //remove tooltip
    e.stopPropagation();
  });

  tooltip.appendChild(yesBtn);
  tooltip.appendChild(noBtn);
}

*/