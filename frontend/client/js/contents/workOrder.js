import FetchAPI from "../fetch-api";
import * as htmls from "../htmls";

const clientsDOM = document.getElementById("clients");
const clientInputDOM = document.getElementById("clientInput");
const clientsPopupDOM = document.getElementById("clientsPopup");
const closeClientsPopupDOM = document.getElementById("closeClientsPopup");
const searchClientDOM = document.getElementById("searchClient");
const searchClientFormDOM = document.getElementById("searchClientForm");
const addDOM = document.getElementById("add");
const orderPopupDetailsDOM = document.getElementById("workDetails");
const placeDOM = document.getElementById("place");

const itemsDOM = document.getElementById("items");
const itemsPopupDOM = document.getElementById("itemsPopup");
const closeItemsPopupDOM = document.getElementById("closeItemsPopup");

const urgentDOM = document.getElementById("urgent");
const commentDOM = document.getElementById("comment");
const popupDOM = document.getElementById("popup");

const contentDOM = document.getElementById("content");

const workDetailPopupDOM = document.getElementById("workDetailPopup");
const closeWorkDetailPopupDOM = document.querySelector(
  "#workDetailPopup #close"
);
const workInfosDOM = document.getElementById("workInfos");
const bodyDOM = document.querySelector("body");
const newItemDOM = document.getElementById("newItem");
const createClientPopupDOM = document.getElementById("createClientPopup");
const searchClientPopupDOM = document.getElementById("searchClientPopup");
const newClientDOM = document.getElementById("newClient");
const createClientFormDOM = document.getElementById("createClientForm");
const associationDOM = document.getElementById("association");
const nameDOM = document.getElementById("name");
const telephoneDOM = document.getElementById("telephone");
const searchItemPopupDOM = document.getElementById("searchItemPopup");
const createItemPopupDOM = document.getElementById("createItemPopup");

const navDOM = document.getElementById("nav");
const headerDOM = document.getElementById("header");

async function clickClientHandler() {
  const id = this.dataset.id;
  const response = await FetchAPI.get(`/clients/${id}`);
  if (response) {
    const data = await response.json();
    clientInputDOM.value = data.client.association;
    clientInputDOM.dataset.id = data.client.id;
    clientsPopupDOM.classList.add("hidden");
  }
}

async function clickItemHandler() {
  const id = this.dataset.id;
  const response = await FetchAPI.get(`/items/${id}`);
  if (response) {
    const data = await response.json();
    const workDetailDOM = orderPopupDetailsDOM.querySelector(
      "#workDetail:last-child"
    );
    const inputDOM = workDetailDOM.querySelector("input:first-child");
    const itemIdDOM = inputDOM;
    itemIdDOM.value = data.item.name;
    itemIdDOM.dataset.id = data.item.id;
    itemsPopupDOM.classList.add("hidden");
  }
}

function bodyHandler(event) {
  if (event.target === workDetailPopupDOM) {
    return;
  }

  const spanDOMs = workDetailPopupDOM.querySelectorAll("span");
  for (const spanDOM of spanDOMs) {
    if (event.target === spanDOM) {
      return;
    }
  }

  const divDOMs = workDetailPopupDOM.querySelectorAll("div");
  for (const divDOM of divDOMs) {
    if (event.target === divDOM) {
      return;
    }
  }

  bodyDOM.removeEventListener("click", bodyHandler);
  popupDOM.classList.add("hidden");
  workDetailPopupDOM.classList.add("hidden");
  popupDOM.classList.remove("blur");
  workDetailPopupDOM.classList.remove("blur");
  navDOM.classList.remove("blur");
  headerDOM.classList.remove("blur");
}

const clientInputFocusHandler = async () => {
  if (clientsPopupDOM.classList.contains("hidden")) {
    clientsPopupDOM.classList.remove("hidden");
    searchClientPopupDOM.classList.remove("hidden");
    createClientPopupDOM.classList.add("hidden");
    const icon = newClientDOM.querySelector("i");
    icon.className = icon.className.replace("solid", "regular");

    const response = await FetchAPI.get("/clients");
    if (response) {
      const data = await response.json();
      let html = "";

      for (const client of data.clients) {
        html += htmls.clientList(client);
      }

      clientsDOM.textContent = "";
      clientsDOM.insertAdjacentHTML("beforeend", html);
    }

    const clientDOMs = clientsDOM.querySelectorAll("#client");
    for (const clientDOM of clientDOMs) {
      clientDOM.addEventListener("click", clickClientHandler);
    }
    return;
  }

  clientsPopupDOM.classList.add("hidden");
};

const searchClientFormHandler = async (event) => {
  event.preventDefault();

  const searchClient = searchClientDOM.value;
  const regExp = new RegExp(searchClient, "i");

  const clientDOMs = clientsDOM.querySelectorAll("#client");
  for (const clientDOM of clientDOMs) {
    const association = clientDOM.querySelector("#association").textContent;
    const isAssociation = regExp.test(association);
    if (isAssociation) {
      clientDOM.classList.remove("hidden");
      continue;
    }

    const name = clientDOM.querySelector("#name").textContent;
    const isName = regExp.test(name);
    if (isName) {
      clientDOM.classList.remove("hidden");
      continue;
    }

    const telephone = clientDOM.querySelector("#telephone").textContent;
    const isTelephone = regExp.test(telephone);
    if (isTelephone) {
      clientDOM.classList.remove("hidden");
      continue;
    }
    clientDOM.classList.add("hidden");
  }
};

const closeClientsPopupHandler = () => {
  clientsPopupDOM.classList.add("hidden");
};

const addHandler = async () => {
  itemsPopupDOM.classList.remove("hidden");
  searchItemPopupDOM.classList.remove("hidden");
  createItemPopupDOM.classList.add("hidden");
  const icon = newItemDOM.querySelector("i");
  icon.className = icon.className.replace("solid", "regular");

  const workDetailDOM = orderPopupDetailsDOM.querySelector(
    "#workDetail:last-child"
  );
  if (workDetailDOM) {
    const itemDOM = workDetailDOM.querySelector("#item");
    if (!itemDOM.value) {
      alert("Item not found");
      return;
    }
  }

  const html = htmls.workDetailList();
  orderPopupDetailsDOM.insertAdjacentHTML("beforeend", html);

  const newWorkDetailDOM = orderPopupDetailsDOM.querySelector(
    "#workDetail:last-child"
  );
  const deleteDOM = newWorkDetailDOM.querySelector("#delete");
  deleteDOM.addEventListener("click", () => {
    newWorkDetailDOM.remove();
  });

  const response = await FetchAPI.get("/items");
  if (response) {
    const data = await response.json();
    let html = "";

    for (const item of data.items) {
      html += htmls.itemList(item);
    }
    itemsDOM.textContent = "";
    itemsDOM.insertAdjacentHTML("beforeend", html);

    const itemDOMs = itemsDOM.querySelectorAll("#item");
    for (const itemDOM of itemDOMs) {
      itemDOM.addEventListener("click", clickItemHandler);
    }
  }
};

const placeHandler = async () => {
  const workDetailDOMs = orderPopupDetailsDOM.querySelectorAll("#workDetail");
  for (const workDetailDOM of workDetailDOMs) {
    const itemDOM = workDetailDOM.querySelector("#item");
    const depthDOM = workDetailDOM.querySelector("#depth");
    const widthDOM = workDetailDOM.querySelector("#width");
    const lengthDOM = workDetailDOM.querySelector("#length");
    const quantityDOM = workDetailDOM.querySelector("#quantity");

    const item_id = itemDOM.dataset.id;
    const depth = depthDOM.value;
    const width = widthDOM.value;
    const length = lengthDOM.value;
    const quantity = quantityDOM.value;

    // TODO: 잔재 관련 기능 추가
    const remnant = workDetailDOM.querySelector("#remnant").value;

    if (!item_id) {
      alert("Provide item_id");
      itemDOM.focus();
      return;
    }

    if (!depth) {
      alert("Provide depth");
      depthDOM.focus();
      return;
    }

    if (!width) {
      alert("Provide width");
      widthDOM.focus();
      return;
    }

    if (!length) {
      alert("Provide length");
      lengthDOM.focus();
      return;
    }

    if (!quantity) {
      alert("Provide quantity");
      quantityDOM.focus();
      return;
    }
  }

  const client_id = clientInputDOM.dataset.id;
  if (!client_id) {
    alert("Client not found");
    return;
  }

  let workOrder;
  let response = await FetchAPI.post("/work-orders", {
    client_id,
    is_urgent: urgentDOM.checked,
    comment: commentDOM.value,
  });
  if (response) {
    const data = await response.json();
    workOrder = data.workOrder;
  }
  if (!workOrder) {
    return;
  }

  let client;
  response = await FetchAPI.get(`/clients/${workOrder.client_id}`);
  if (response) {
    const data = await response.json();
    client = data.client;
  }
  if (!client) {
    return;
  }

  for (const workDetailDOM of workDetailDOMs) {
    const item_id = workDetailDOM.querySelector("#item").dataset.id;
    const depth = workDetailDOM.querySelector("#depth").value;
    const width = workDetailDOM.querySelector("#width").value;
    const length = workDetailDOM.querySelector("#length").value;
    const quantity = workDetailDOM.querySelector("#quantity").value;

    // TODO: 잔재 관련 기능 추가
    const remnant = workDetailDOM.querySelector("#remnant").value;

    response = await FetchAPI.post("/work-details", {
      work_order_id: workOrder.id,
      item_id,
      width,
      length,
      depth,
      quantity,
    });
  }

  const html = htmls.workOrderList(workOrder, client);
  contentDOM.insertAdjacentHTML("afterbegin", html);
  popupDOM.classList.add("hidden");
  const createWorkOrderDOM = document.getElementById("createWorkOrder");
  const icon = createWorkOrderDOM.querySelector("i");
  icon.className = icon.className.replace("solid", "regular");
};

const closeItemsPopupHandler = () => {
  itemsPopupDOM.classList.add("hidden");
};

async function workOrderContainerHandler(event) {
  event.stopPropagation();

  if (workDetailPopupDOM.classList.contains("hidden")) {
    bodyDOM.addEventListener("click", bodyHandler);
  }
  popupDOM.classList.remove("hidden");
  workDetailPopupDOM.classList.remove("hidden");
  navDOM.classList.add("blur");
  headerDOM.classList.add("blur");
  const workOrderId = this.dataset.id;

  let workOrder;
  let response = await FetchAPI.get(`/work-orders/${workOrderId}`);
  if (response) {
    const data = await response.json();
    workOrder = data.workOrder;
    let html = `
    <div>
      <div class='top'>
        <span>${workOrder.is_complete ? "complete" : "resolving"}</span>
      </div>
      ${
        workOrder.is_complete
          ? `<div><span>${workOrder.end_date}</span></div>`
          : ""
      }
    </div>
    `;
    const completeInfoDOM = workDetailPopupDOM.querySelector("#completeInfo");
    completeInfoDOM.textContent = "";
    completeInfoDOM.insertAdjacentHTML("beforeend", html);

    html = `
    <div>
      <span>${workOrder.is_urgent ? "urgent" : ""}</span>
    </div>
    `;
    const urgentInfoDOM = workDetailPopupDOM.querySelector("#urgentInfo");
    urgentInfoDOM.textContent = "";
    urgentInfoDOM.insertAdjacentHTML("beforeend", html);

    html = `
    <div>
      <span>${workOrder.comment}</span>
    </div>
    `;
    const commentInfoDOM = workDetailPopupDOM.querySelector("#commentInfo");
    commentInfoDOM.textContent = "";
    commentInfoDOM.insertAdjacentHTML("beforeend", html);
  }

  const clientId = this.dataset.client_id;
  response = await FetchAPI.get(`/clients/${clientId}`);
  if (response) {
    const data = await response.json();
    const clientDOM = workDetailPopupDOM.querySelector("#client");
    const html = htmls.clientList(data.client);
    clientDOM.textContent = "";
    clientDOM.insertAdjacentHTML("beforeend", html);
  }

  response = await FetchAPI.get(`/work-orders/${workOrderId}/details`);
  if (response) {
    const data = await response.json();
    const workDetails = data.workDetails;
    let html = "";

    for (const workDetail of workDetails) {
      const itemId = workDetail.item_id;
      const response = await FetchAPI.get(`/items/${itemId}`);
      if (response) {
        const data = await response.json();
        const item = data.item;
        const workInfo = { workDetail, item };
        html += htmls.workInfoList(workInfo);
      }
    }
    workInfosDOM.textContent = "";
    workInfosDOM.insertAdjacentHTML("beforeend", html);
  }
}

const closeWorkDetailPopupHandler = () => {
  bodyDOM.removeEventListener("click", bodyHandler);

  popupDOM.classList.add("hidden");
  workDetailPopupDOM.classList.add("hidden");
};

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

  const response = await FetchAPI.post("/clients", {
    association,
    name,
    telephone,
  });
  if (response) {
    associationDOM.value = "";
    nameDOM.value = "";
    telephoneDOM.value = "";

    const data = await response.json();
    const html = htmls.clientList(data.client);
    clientsDOM.insertAdjacentHTML("afterbegin", html);
    const clientDOM = clientsDOM.querySelector("#client:first-child");
    clientDOM.addEventListener("click", clickClientHandler);
  }
};

const newClientHandler = () => {
  if (createClientPopupDOM.classList.contains("hidden")) {
    searchClientPopupDOM.classList.add("hidden");
    createClientPopupDOM.classList.remove("hidden");
    const icon = newClientDOM.querySelector("i");
    icon.className = icon.className.replace("regular", "solid");
    return;
  }

  searchClientPopupDOM.classList.remove("hidden");
  createClientPopupDOM.classList.add("hidden");
  const icon = newClientDOM.querySelector("i");
  icon.className = icon.className.replace("solid", "regular");
};

const workDetailPopupHandler = (event) => {
  const isMouseEnter = event.type === "mouseenter";
  if (isMouseEnter) {
    workDetailPopupDOM.classList.remove("blur");
    workDetailPopupDOM.classList.add("clean");
    popupDOM.classList.remove("blur");
    popupDOM.classList.add("clean");
    return;
  }

  // mouse leave
  workDetailPopupDOM.classList.remove("clean");
  workDetailPopupDOM.classList.add("blur");
  popupDOM.classList.remove("clean");
  popupDOM.classList.add("blur");
};

const docsHandler = (event) => {
  const isESC = event.key === "Escape";
  if (isESC) {
    bodyDOM.removeEventListener("click", bodyHandler);
    popupDOM.classList.add("hidden");
    workDetailPopupDOM.classList.add("hidden");
    popupDOM.classList.remove("blur");
    workDetailPopupDOM.classList.remove("blur");
    navDOM.classList.remove("blur");
    headerDOM.classList.remove("blur");
  }
};

document.addEventListener("keydown", docsHandler);
workDetailPopupDOM.addEventListener("mouseenter", workDetailPopupHandler);
workDetailPopupDOM.addEventListener("mouseleave", workDetailPopupHandler);
newClientDOM.addEventListener("click", newClientHandler);
createClientFormDOM.addEventListener("submit", createClientFormHandler);
closeWorkDetailPopupDOM.addEventListener("click", closeWorkDetailPopupHandler);
closeItemsPopupDOM.addEventListener("click", closeItemsPopupHandler);
placeDOM.addEventListener("click", placeHandler);
addDOM.addEventListener("click", addHandler);
closeClientsPopupDOM.addEventListener("click", closeClientsPopupHandler);
searchClientFormDOM.addEventListener("submit", searchClientFormHandler);
clientInputDOM.addEventListener("focus", clientInputFocusHandler);

(() => {
  const workOrderContainerDOMs = document.querySelectorAll(
    "#workOrderContainer"
  );
  workOrderContainerDOMs.forEach(async (workOrderContainerDOM) => {
    workOrderContainerDOM.addEventListener("click", workOrderContainerHandler);

    const id = workOrderContainerDOM.dataset.client_id;

    const response = await FetchAPI.get(`/clients/${id}`);
    if (response) {
      const data = await response.json();
      const html = `
      <div class='left'>
        <span>${data.client.association}</span>
      </div>
      <div class='right'>
        <span>${data.client.name}</span>
      </div>
      `;
      const clientDOM = workOrderContainerDOM.querySelector("#client");
      clientDOM.insertAdjacentHTML("beforeend", html);
    }
  });
})();
