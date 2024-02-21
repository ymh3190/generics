import FetchAPI from "../fetch-api";
import * as htmls from "../html";

const createWorkOrderDOM = document.getElementById("createWorkOrder");
const createRemnantDOM = document.getElementById("createRemnant");
const createClientDOM = document.getElementById("createClient");

const popupDOM = document.getElementById("popup");
const closeDOM = document.getElementById("close");
const itemsPopupDOM = document.getElementById("itemsPopup");
const searchItemFormDOM = document.getElementById("searchItemForm");
const searchItemDOM = document.getElementById("searchItem");
const itemsDOM = document.getElementById("items");
const newItemDOM = document.getElementById("newItem");
const createItemPopupDOM = document.getElementById("createItemPopup");
// const createItemFormDOM = document.getElementById("createItemForm");
const nameDOM = document.querySelector("#itemsPopup #name");
const searchItemPopupDOM = document.getElementById("searchItemPopup");

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
    searchItemPopupDOM.classList.add("hidden");
    return;
  }

  icon.className = icon.className.replace("solid", "regular");
  searchItemPopupDOM.classList.remove("hidden");
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
    const html = htmls.itemList(data.item);
    itemsDOM.insertAdjacentHTML("beforeend", html);
    nameDOM.value = "";
    const icon = newItemDOM.querySelector("i");
    icon.className = icon.className.replace("solid", "regular");
    searchItemFormDOM.classList.remove("hidden");
    createItemPopupDOM.classList.add("hidden");
    itemsPopupDOM.classList.add("hidden");
    const orderPopupDetailsDOM = document.getElementById("workDetails");
    const workDetailDOM = orderPopupDetailsDOM.querySelector(
      "#workDetail:last-child"
    );
    const itemDOM = workDetailDOM.querySelector("input:first-child");
    itemDOM.value = data.item.name;
    itemDOM.dataset.id = data.item.id;
  }
};

(() => {
  if (createWorkOrderDOM || createRemnantDOM) {
    // createItemFormDOM.addEventListener("submit", createItemFormHandler);
    // newItemDOM.addEventListener("click", newItemHandler);
    searchItemFormDOM.addEventListener("submit", searchItemFormHandler);
  }

  if (createWorkOrderDOM) {
    const urgentDOM = document.getElementById("urgent");
    const clientInputDOM = document.getElementById("clientInput");
    const workDetailsDOM = document.getElementById("workDetails");
    const commentDOM = document.getElementById("comment");
    const clientsPopupDOM = document.getElementById("clientsPopup");
    const workOrderPopupDOM = document.getElementById("workOrderPopup");
    const workInfoPopupDOM = document.getElementById("workInfoPopup");

    const createWorkOrderHandler = () => {
      if (popupDOM.classList.contains("hidden")) {
        popupDOM.classList.remove("hidden");
        popupDOM.classList.remove("blur");
        workOrderPopupDOM.classList.remove("hidden");
        workInfoPopupDOM.classList.remove("blur");
        urgentDOM.checked = false;
        clientInputDOM.value = "";
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
    };

    createWorkOrderDOM.addEventListener("click", createWorkOrderHandler);
    closeDOM.addEventListener("click", createWorkOrderHandler);
    return;
  }

  if (createRemnantDOM) {
    const remnantDetailsDOM = document.getElementById("remnantDetails");
    const remnantDetailPopupDOM = document.getElementById("remnantDetailPopup");

    const createRemnantHandler = () => {
      if (popupDOM.classList.contains("hidden")) {
        popupDOM.classList.remove("hidden");
        remnantDetailPopupDOM.classList.remove("hidden");
        const remnantDetailsDOMs =
          remnantDetailsDOM.querySelectorAll("#remnantDetail");
        for (const remnantDetailsDOM of remnantDetailsDOMs) {
          remnantDetailsDOM.remove();
        }
        return;
      }

      popupDOM.classList.add("hidden");
      itemsPopupDOM.classList.add("hidden");
    };

    createRemnantDOM.addEventListener("click", createRemnantHandler);
    closeDOM.addEventListener("click", createRemnantHandler);
    return;
  }

  if (createClientDOM) {
    const clientPopupDOM = document.getElementById("clientPopup");
    const clientsDOM = document.getElementById("clients");
    const workInfoPopupDOM = document.getElementById("workInfoPopup");

    const createClientHandler = () => {
      if (popupDOM.classList.contains("hidden")) {
        popupDOM.classList.remove("hidden");
        clientPopupDOM.classList.remove("hidden");
        clientsDOM
          .querySelectorAll("#clientContainer")
          .forEach((clientContainer) => {
            clientContainer.remove();
          });
        return;
      }

      popupDOM.classList.add("hidden");
      clientPopupDOM.classList.add("hidden");
      workInfoPopupDOM.classList.add("hidden");
    };

    createClientDOM.addEventListener("click", createClientHandler);
    closeDOM.addEventListener("click", createClientHandler);
  }
})();
