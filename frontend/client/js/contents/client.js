import FetchAPI from "../fetch-api";
import * as htmls from "../html";

const bodyDOM = document.querySelector("body");
const popupDOM = document.getElementById("popup");
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
const commentDOM = document.getElementById("comment");

const navDOM = document.getElementById("nav");
const headerDOM = document.getElementById("header");

const clientPopupDOM = document.getElementById("clientPopup");

//#region update client
const updateClientPopupDOM = document.getElementById("updateClientPopup");
const closeUpdateClientPopupDOM = document.getElementById(
  "closeUpdateClientPopup"
);
const updateClientFormDOM = document.getElementById("updateClientForm");
const updatedAssociationDOM = document.getElementById("updatedAssociation");
const updatedNameDOM = document.getElementById("updatedName");
const updatedTelephoneDOM = document.getElementById("updatedTelephone");
const updatedCommentDOM = document.getElementById("updatedComment");
//#endregion update client

let isUpdate;

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

  const rightDOM = this.querySelector("#right");
  const anchorDOMs = rightDOM.querySelectorAll("a");
  const iconDOMs = rightDOM.querySelectorAll("i");
  const embeddedDOM = rightDOM.querySelector(".embedded");
  const spanDOMs = rightDOM.querySelectorAll("span");

  if (event.target === embeddedDOM) {
    return;
  }

  if (event.target === rightDOM) {
    return;
  }

  for (const spanDOM of spanDOMs) {
    if (event.target === spanDOM) {
      return;
    }
  }

  for (const anchorDOM of anchorDOMs) {
    if (event.target === anchorDOM) {
      return;
    }
  }

  for (const iconDOM of iconDOMs) {
    if (event.target === iconDOM) {
      return;
    }
  }

  if (workInfoPopupDOM.classList.contains("hidden")) {
    bodyDOM.addEventListener("click", bodyHandler);
  }

  popupDOM.classList.remove("hidden");
  workInfoPopupDOM.classList.remove("hidden");
  updateClientPopupDOM.classList.add("hidden");
  navDOM.classList.add("blur");
  headerDOM.classList.add("blur");

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

function rightHandler() {
  const embeddedDOMs = contentDOM.querySelectorAll("#embedded");
  const embeddedDOM = this.querySelector("#embedded");
  embeddedDOMs.forEach((dom) => {
    if (dom !== embeddedDOM) {
      dom.classList.add("hidden");
      return;
    }

    embeddedDOM.classList.remove("hidden");
  });
}

function updateHandler(event) {
  event.stopPropagation();

  popupDOM.classList.remove("hidden");
  updateClientPopupDOM.classList.remove("hidden");
  popupDOM.classList.add("transparent");

  const embeddedDOMs = contentDOM.querySelectorAll("#embedded");
  embeddedDOMs.forEach((embeddedDOM) => {
    embeddedDOM.classList.add("hidden");
  });

  const updatedAssociationDOM = updateClientFormDOM.querySelector(
    "#updatedAssociation"
  );
  const updatedNameDOM = updateClientFormDOM.querySelector("#updatedName");
  const updatedTelephoneDOM =
    updateClientFormDOM.querySelector("#updatedTelephone");
  const updatedCommentDOM =
    updateClientFormDOM.querySelector("#updatedComment");

  updatedAssociationDOM.value = this.dataset.association;
  updatedNameDOM.value = this.dataset.name;
  updatedTelephoneDOM.value = this.dataset.telephone;
  updatedCommentDOM.value = this.dataset.comment;

  updateClientFormDOM.dataset.id = this.dataset.id;
}

async function deleteHandler(event) {
  event.stopPropagation();

  if (!confirm("Delete forever?")) {
    return;
  }

  const clientId = this.dataset.id;
  const response = await FetchAPI.delete(`/clients/${clientId}`);
  if (response) {
    clientContainerDOMs.forEach((clientContainerDOM) => {
      const id = clientContainerDOM.dataset.id;
      if (clientId === id) {
        clientContainerDOM.remove();
      }
    });
  }

  const embeddedDOMs = document.querySelectorAll("#embedded");
  embeddedDOMs.forEach((embeddedDOM) => {
    embeddedDOM.classList.add("hidden");
  });
}

function bodyHandler(event) {
  if (isUpdate) {
    return;
  }

  if (event.target === updateClientPopupDOM) {
    return;
  }

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

  popupDOM.classList.remove("blur");
  workInfoPopupDOM.classList.remove("blur");
  navDOM.classList.remove("blur");
  headerDOM.classList.remove("blur");

  popupDOM.classList.add("hidden");
  workInfoPopupDOM.classList.add("hidden");
  workDetailPopupDOM.classList.add("hidden");
}

const createClientFormHandler = async (event) => {
  event.preventDefault();

  const association = associationDOM.value;
  const name = nameDOM.value;
  const telephone = telephoneDOM.value;
  const comment = commentDOM.value;

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
    comment: comment ? comment : "",
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
  commentDOM.value = "";
};

const closeWorkInfoPopupHandler = () => {
  workInfoPopupDOM.classList.add("hidden");
  popupDOM.classList.add("hidden");
  workDetailPopupDOM.classList.add("hidden");

  navDOM.classList.remove("blur");
  headerDOM.classList.remove("blur");
};

const closeWorkDetailPopupHandler = () => {
  workDetailPopupDOM.classList.add("hidden");
};

const workInfoPopupHandler = (event) => {
  const isMouseEnter = event.type === "mouseenter";
  if (isMouseEnter) {
    workInfoPopupDOM.classList.remove("blur");
    workInfoPopupDOM.classList.add("clean");
    popupDOM.classList.remove("blur");
    popupDOM.classList.add("clean");
    return;
  }

  // mouse leave
  workInfoPopupDOM.classList.remove("clean");
  workInfoPopupDOM.classList.add("blur");
  popupDOM.classList.remove("clean");
  popupDOM.classList.add("blur");
};

const docsHandler = (event) => {
  const isESC = event.key === "Escape";
  if (isESC && !clientPopupDOM.classList.contains("hidden")) {
    bodyDOM.removeEventListener("click", bodyHandler);
    workInfoPopupDOM.addEventListener("mouseleave", workInfoPopupHandler);
    popupDOM.classList.add("hidden");
    workDetailPopupDOM.classList.add("hidden");
    workInfoPopupDOM.classList.add("hidden");
    popupDOM.classList.remove("blur");
    workInfoPopupDOM.classList.remove("blur");
    navDOM.classList.remove("blur");
    headerDOM.classList.remove("blur");
  }
};

const closeUpdateClientPopupHandler = () => {
  popupDOM.classList.remove("transparent");
  popupDOM.classList.add("hidden");
  updateClientPopupDOM.classList.add("hidden");
};

const updateClientFormHandler = async (event) => {
  event.preventDefault();

  const updatedAssociation = updatedAssociationDOM.value;
  const updatedName = updatedNameDOM.value;
  const updatedTelephone = updatedTelephoneDOM.value;
  const updatedComment = updatedCommentDOM.value;

  if (!updatedAssociation) {
    alert("Association not found");
    updatedAssociationDOM.focus();
    return;
  }

  if (!updatedName) {
    alert("Name not found");
    updatedNameDOM.focus();
    return;
  }

  if (!updatedTelephone) {
    alert("Telephone not found");
    updatedTelephoneDOM.focus();
    return;
  }

  if (!updatedComment) {
    alert("Comment not found");
    updatedCommentDOM.focus();
    return;
  }

  const data = {
    association: updatedAssociation,
    name: updatedName,
    telephone: updatedTelephone,
    comment: updatedComment,
  };

  const id = updateClientFormDOM.dataset.id;
  const response = await FetchAPI.patch(`/clients/${id}`, data);
  if (response) {
    const data = await response.json();
    const client = data.client;
    clientContainerDOMs.forEach((clientContainerDOM) => {
      const clientId = clientContainerDOM.dataset.id;
      if (clientId === id) {
        const associationDOM = clientContainerDOM.querySelector("#association");
        const nameDOM = clientContainerDOM.querySelector("#name");
        const telephoneDOM = clientContainerDOM.querySelector("#telephone");
        associationDOM.textContent = client.association;
        nameDOM.textContent = client.name;
        telephoneDOM.textContent = client.telephone;
      }
    });
  }
};

updateClientFormDOM.addEventListener("submit", updateClientFormHandler);
closeUpdateClientPopupDOM.addEventListener(
  "click",
  closeUpdateClientPopupHandler
);
document.addEventListener("keydown", docsHandler);
workInfoPopupDOM.addEventListener("mouseleave", workInfoPopupHandler);
workInfoPopupDOM.addEventListener("mouseenter", workInfoPopupHandler);
closeWorkDetailPopupDOM.addEventListener("click", closeWorkDetailPopupHandler);
closeWorkInfoPopupDOM.addEventListener("click", closeWorkInfoPopupHandler);
createClientFormDOM.addEventListener("submit", createClientFormHandler);

const clientContainerDOMs = document.querySelectorAll("#clientContainer");
clientContainerDOMs.forEach((clientContainerDOM) => {
  clientContainerDOM.addEventListener("click", clientContainerHandler);
  const rightDOM = clientContainerDOM.querySelector("#right");
  rightDOM.addEventListener("click", rightHandler);
  const updateDOM = clientContainerDOM.querySelector("#update");
  updateDOM.addEventListener("click", updateHandler);
  const deleteDOM = clientContainerDOM.querySelector("#delete");
  deleteDOM.addEventListener("click", deleteHandler);
});
