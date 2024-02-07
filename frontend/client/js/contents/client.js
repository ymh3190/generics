import FetchAPI from "../fetch-api";
import * as htmls from "../htmls";

const bodyDOM = document.querySelector("body");
const popupDOM = document.getElementById("popup");
const createClientDOM = document.getElementById("createClient");
const createClientFormDOM = document.querySelector(
  "#createClientPopup #createClientForm"
);
const associationDOM = document.querySelector(
  "#createClientPopup #association"
);
const nameDOM = document.querySelector("#createClientPopup #name");
const telephoneDOM = document.querySelector("#createClientPopup #telephone");
const contentDOM = document.getElementById("content");
const workInfoPopupDOM = document.getElementById("workInfoPopup");
const closeWorkInfoPopupDOM = document.querySelector("#workInfoPopup #close");
const infoContainersDOM = document.getElementById("infoContainers");
const clientsDOM = document.getElementById("clients");
const workDetailPopupDOM = document.getElementById("workDetailPopup");
const closeWorkDetailPopupDOM = document.getElementById("closeWorkDetailPopup");
const workInfosDOM = document.getElementById("workInfos");

async function clientWorkInfoContainerHandler() {
  workInfoPopupDOM.removeEventListener("mouseleave", workInfoPopupHandler);
  const work_order_id = this.dataset.id;

  let workOrder;
  let response = await FetchAPI.get(`/work-orders/${work_order_id}`);
  if (response) {
    const data = await response.json();
    workOrder = data.workOrder;
  }
  if (!workOrder) {
    return;
  }

  response = await FetchAPI.get(`/work-orders/${work_order_id}/details`);
  if (response) {
    workDetailPopupDOM.classList.remove("hidden");

    const data = await response.json();
    let workDetailHtml = "";
    for (const workDetail of data.workDetails) {
      let item;
      const response = await FetchAPI.get(`/items/${workDetail.item_id}`);
      if (response) {
        const data = await response.json();
        item = data.item;
      }
      if (!item) {
        return;
      }
      const workInfo = { workOrder, workDetail, item };
      workDetailHtml += htmls.detailInfoList(workInfo);
    }
    workInfosDOM.textContent = "";
    workInfosDOM.insertAdjacentHTML("beforeend", workDetailHtml);
  }
}

async function clientContainerHandler(event) {
  event.stopPropagation();

  if (workInfoPopupDOM.classList.contains("hidden")) {
    bodyDOM.addEventListener("click", bodyHandler);
  }

  popupDOM.classList.remove("hidden");
  workInfoPopupDOM.classList.remove("hidden");
  const icon = createClientDOM.querySelector("i");
  icon.className = icon.className.replace("solid", "regular");

  const client_id = this.dataset.id;

  let workOrders;
  let response = await FetchAPI.post("/work-orders/client", { client_id });
  if (response) {
    const data = await response.json();
    workOrders = data.workOrders;
    let html = "";
    for (const workOrder of data.workOrders) {
      html += htmls.clientWorkInfoList(workOrder);
    }
    infoContainersDOM.textContent = "";
    infoContainersDOM.insertAdjacentHTML("beforeend", html);

    const clientWorkInfoContainerDOMs = infoContainersDOM.querySelectorAll(
      "#clientWorkInfoContainer"
    );
    clientWorkInfoContainerDOMs.forEach((clientWorkInfoContainerDOM) => {
      clientWorkInfoContainerDOM.addEventListener(
        "click",
        clientWorkInfoContainerHandler
      );
    });
  }
  if (!workOrders) {
    return;
  }
}

function bodyHandler(event) {
  if (event.target === workInfoPopupDOM) {
    return;
  }

  const spanDOMs = workInfoPopupDOM.querySelectorAll("span");
  for (const spanDOM of spanDOMs) {
    if (event.target === spanDOM) {
      return;
    }
  }

  const infoDOMs = workInfoPopupDOM.querySelectorAll("div");
  for (const divDOM of infoDOMs) {
    if (event.target === divDOM) {
      return;
    }
  }

  if (event.target === workDetailPopupDOM) {
    return;
  }

  const detailDOMs = workDetailPopupDOM.querySelectorAll("div");
  for (const divDOM of detailDOMs) {
    if (event.target === divDOM) {
      return;
    }
  }

  const closeDOM = workDetailPopupDOM.querySelector("button");
  if (event.target === closeDOM) {
    return;
  }

  bodyDOM.removeEventListener("click", bodyHandler);
  workInfoPopupDOM.addEventListener("mouseleave", workInfoPopupHandler);
  popupDOM.classList.add("hidden");
  workInfoPopupDOM.classList.add("hidden");
  workDetailPopupDOM.classList.add("hidden");
  popupDOM.classList.remove("mouse-leave");
  workInfoPopupDOM.classList.remove("mouse-leave");
}

const createClientFormHandler = async (event) => {
  event.preventDefault();

  const association = associationDOM.value;
  const name = nameDOM.value;
  const telephone = telephoneDOM.value;

  if (!association) {
    alert("Provide association");
    associationDOM.focus();
    return;
  }

  if (!name) {
    alert("Provide name");
    nameDOM.focus();
    return;
  }

  if (!telephone) {
    alert("Provide telephone");
    telephoneDOM.focus();
    return;
  }

  const response = await FetchAPI.post(`/clients`, {
    association,
    name,
    telephone,
  });
  if (response) {
    const data = await response.json();
    const html = htmls.clientContainer(data.client);
    contentDOM.insertAdjacentHTML("afterbegin", html);
    clientsDOM.insertAdjacentHTML("afterbegin", html);

    const newClientContainerDOM = document.querySelector(
      "#clientContainer:first-child"
    );
    newClientContainerDOM.addEventListener("click", clientContainerHandler);
  }

  associationDOM.value = "";
  nameDOM.value = "";
  telephoneDOM.value = "";
};

const closeWorkInfoPopupHandler = () => {
  workInfoPopupDOM.classList.add("hidden");
  popupDOM.classList.add("hidden");
  workDetailPopupDOM.classList.add("hidden");
};

const closeWorkDetailPopupHandler = () => {
  workDetailPopupDOM.classList.add("hidden");
};

const workInfoPopupHandler = (event) => {
  const isMouseEnter = event.type === "mouseenter";
  if (isMouseEnter) {
    workInfoPopupDOM.classList.remove("mouse-leave");
    workInfoPopupDOM.classList.add("mouse-enter");
    popupDOM.classList.remove("mouse-leave");
    popupDOM.classList.add("mouse-enter");
    return;
  }

  // mouse leave
  workInfoPopupDOM.classList.remove("mouse-enter");
  workInfoPopupDOM.classList.add("mouse-leave");
  popupDOM.classList.remove("mouse-enter");
  popupDOM.classList.add("mouse-leave");
};

const documentHandler = (event) => {
  const isESC = event.key === "Escape";
  if (isESC) {
    bodyDOM.removeEventListener("click", bodyHandler);
    workInfoPopupDOM.addEventListener("mouseleave", workInfoPopupHandler);
    popupDOM.classList.add("hidden");
    workInfoPopupDOM.classList.add("hidden");
    workDetailPopupDOM.classList.add("hidden");
    popupDOM.classList.remove("mouse-leave");
    workInfoPopupDOM.classList.remove("mouse-leave");
  }
};

document.addEventListener("keydown", documentHandler);
workInfoPopupDOM.addEventListener("mouseleave", workInfoPopupHandler);
workInfoPopupDOM.addEventListener("mouseenter", workInfoPopupHandler);
closeWorkDetailPopupDOM.addEventListener("click", closeWorkDetailPopupHandler);
closeWorkInfoPopupDOM.addEventListener("click", closeWorkInfoPopupHandler);
createClientFormDOM.addEventListener("submit", createClientFormHandler);

const clientContainerDOMs = document.querySelectorAll("#clientContainer");
clientContainerDOMs.forEach((clientContainerDOM) => {
  clientContainerDOM.addEventListener("click", clientContainerHandler);
});
