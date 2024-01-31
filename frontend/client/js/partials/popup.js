import FetchAPI from "../fetch-api";

const createWorkOrderDOM = document.getElementById("createWorkOrder");
const createRemnantDOM = document.getElementById("createRemnant");

const popupDOM = document.getElementById("popup");
const closeDOM = document.getElementById("close");
const cancelDOM = document.getElementById("cancel");
const itemsPopupDOM = document.getElementById("itemsPopup");
const searchItemFormDOM = document.getElementById("searchItemForm");
const searchItemDOM = document.getElementById("searchItem");
const itemsDOM = document.getElementById("items");
const newItemDOM = document.getElementById("newItem");
const createItemPopupDOM = document.getElementById("createItemPopup");
const createItemFormDOM = document.getElementById("createItemForm");
const nameDOM = document.querySelector("#itemsPopup #name");

const itemList = (item) => {
  return `
  <div data-id=${item.id} id='item'>
    <span id='name'>${item.name}</span>
  </div>
  `;
};

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

const newItemHandler = () => {
  const icon = newItemDOM.querySelector("i");

  if (createItemPopupDOM.classList.contains("hidden")) {
    icon.className = icon.className.replace("regular", "solid");
    createItemPopupDOM.classList.remove("hidden");
    searchItemFormDOM.classList.add("hidden");
    return;
  }

  icon.className = icon.className.replace("solid", "regular");
  searchItemFormDOM.classList.remove("hidden");
  createItemPopupDOM.classList.add("hidden");
};

const createItemFormHandler = async (event) => {
  event.preventDefault();

  const name = nameDOM.value;
  if (!name) {
    alert("Provide name");
    return;
  }

  const response = await FetchAPI.post("/items", { name });
  if (response) {
    const data = await response.json();
    const html = itemList(data.item);
    itemsDOM.insertAdjacentHTML("beforeend", html);
    nameDOM.value = "";
    const icon = newItemDOM.querySelector("i");
    icon.className = icon.className.replace("solid", "regular");
    searchItemFormDOM.classList.remove("hidden");
    createItemPopupDOM.classList.add("hidden");
    itemsPopupDOM.classList.add("hidden");
  }
};

createItemFormDOM.addEventListener("submit", createItemFormHandler);
newItemDOM.addEventListener("click", newItemHandler);
searchItemFormDOM.addEventListener("submit", searchItemFormHandler);

if (createWorkOrderDOM) {
  const urgentDOM = document.getElementById("urgent");
  const selectedClientDOM = document.getElementById("selectedClient");
  const workDetailsDOM = document.getElementById("workDetails");
  const commentDOM = document.getElementById("comment");
  const clientsPopupDOM = document.getElementById("clientsPopup");
  const workOrderPopupDOM = document.getElementById("workOrderPopup");

  const createWorkOrderHandler = () => {
    const icon = createWorkOrderDOM.querySelector("i");
    if (popupDOM.classList.contains("hidden")) {
      popupDOM.classList.remove("hidden");
      workOrderPopupDOM.classList.remove("hidden");
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
    workOrderPopupDOM.classList.add("hidden");
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
