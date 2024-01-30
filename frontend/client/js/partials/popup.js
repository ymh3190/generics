const createWorkOrderDOM = document.getElementById("createWorkOrder");
const createRemnantDOM = document.getElementById("createRemnant");

const popupDOM = document.getElementById("popup");
const closeDOM = document.getElementById("close");
const cancelDOM = document.getElementById("cancel");
const itemsPopupDOM = document.getElementById("itemsPopup");
const searchItemFormDOM = document.getElementById("searchItemForm");
const searchItemDOM = document.getElementById("searchItem");
const itemsDOM = document.getElementById("items");

const searchItemFormHandler = (event) => {
  event.preventDefault();

  const searchItem = searchItemDOM.value;
  const regExp = new RegExp(searchItem, "i");

  const itemDOMs = itemsDOM.querySelectorAll("#item");
  for (const itemDOM of itemDOMs) {
    const name = itemDOM.querySelector("#name").textContent;
    const isName = regExp.test(name);
    if (isName) {
      itemDOM.classList.remove("hidden");
      continue;
    }
    itemDOM.classList.add("hidden");
  }
};

searchItemFormDOM.addEventListener("submit", searchItemFormHandler);

if (createWorkOrderDOM) {
  const urgentDOM = document.getElementById("urgent");
  const selectedClientDOM = document.getElementById("selectedClient");
  const workDetailsDOM = document.getElementById("workDetails");
  const commentDOM = document.getElementById("comment");
  const clientsPopupDOM = document.getElementById("clientsPopup");

  const createWorkOrderHandler = () => {
    const icon = createWorkOrderDOM.querySelector("i");
    if (popupDOM.classList.contains("hidden")) {
      popupDOM.classList.remove("hidden");
      icon.className = icon.className.replace("regular", "solid");
      urgentDOM.checked = false;
      selectedClientDOM.value = "";
      commentDOM.value = "";
      const workDetailsDOMs = workDetailsDOM.querySelectorAll("#workDetail");
      for (const workDetailsDOM of workDetailsDOMs) {
        workDetailsDOM.remove();
      }
      return;
    }

    popupDOM.classList.add("hidden");
    itemsPopupDOM.classList.add("hidden");
    clientsPopupDOM.classList.add("hidden");
    icon.className = icon.className.replace("solid", "regular");
  };

  createWorkOrderDOM.addEventListener("click", createWorkOrderHandler);

  for (const dom of [closeDOM, cancelDOM]) {
    dom.addEventListener("click", createWorkOrderHandler);
  }
}

if (createRemnantDOM) {
  const remnantDetailsDOM = document.getElementById("remnantDetails");

  const createRemnantHandler = () => {
    const icon = createRemnantDOM.querySelector("i");
    if (popupDOM.classList.contains("hidden")) {
      popupDOM.classList.remove("hidden");
      icon.className = icon.className.replace("regular", "solid");
      const remnantDetailsDOMs =
        remnantDetailsDOM.querySelectorAll("#remnantDetail");
      for (const remnantDetailsDOM of remnantDetailsDOMs) {
        remnantDetailsDOM.remove();
      }
      return;
    }

    popupDOM.classList.add("hidden");
    itemsPopupDOM.classList.add("hidden");
    icon.className = icon.className.replace("solid", "regular");
  };

  createRemnantDOM.addEventListener("click", createRemnantHandler);

  for (const dom of [closeDOM, cancelDOM]) {
    dom.addEventListener("click", createRemnantHandler);
  }
}
