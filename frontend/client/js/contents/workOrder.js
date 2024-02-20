import FetchAPI from "../fetch-api";
import * as htmls from "../html";

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
const commentDOM = document.querySelector("#workOrderPopup #comment");
const popupDOM = document.getElementById("popup");

const contentDOM = document.getElementById("content");

const workInfoPopupDOM = document.getElementById("workInfoPopup");
const closeWorkInfoPopupDOM = document.getElementById("closeWorkInfoPopup");
const workInfosDOM = document.getElementById("workInfos");
const bodyDOM = document.querySelector("body");
const newItemDOM = document.getElementById("newItem");
const createClientPopupDOM = document.getElementById("createClientPopup");
const searchClientPopupDOM = document.getElementById("searchClientPopup");
const newClientDOM = document.getElementById("newClient");
const createClientFormDOM = document.getElementById("createClientForm");
const clientCommentDOM = document.querySelector("#createClientForm #comment");
const associationDOM = document.getElementById("association");
const nameDOM = document.getElementById("name");
const telephoneDOM = document.getElementById("telephone");
const searchItemPopupDOM = document.getElementById("searchItemPopup");
const createItemPopupDOM = document.getElementById("createItemPopup");

const navDOM = document.getElementById("nav");
const headerDOM = document.getElementById("header");

//#region update work-order
const urgentPopupDOM = document.getElementById("urgentPopup");
const closeUrgentPopupDOM = document.getElementById("closeUrgentPopup");
const updatedUrgentDOM = document.getElementById("updatedUrgent");
const workDetailPopupDOM = document.getElementById("workDetailPopup");
const closeWorkDetailPopupDOM = document.getElementById("closeWorkDetailPopup");
const updatedItemDOM = document.getElementById("updatedItem");
const updatedDepthDOM = document.getElementById("updatedDepth");
const updatedWidthDOM = document.getElementById("updatedWidth");
const updatedLengthDOM = document.getElementById("updatedLength");
const updatedQuantityDOM = document.getElementById("updatedQuantity");
const updatedRemnantDOM = document.getElementById("updatedRemnant");
const commentPopupDOM = document.getElementById("commentPopup");
const closeCommentPopupDOM = document.getElementById("closeCommentPopup");
const updateCommentFormDOM = document.getElementById("updateCommentForm");
const urgentInfoDOM = document.getElementById("urgentInfo");
const commentInfoDOM = document.getElementById("commentInfo");
const completeInfoDOM = document.getElementById("completeInfo");
const buttonOptionDOM = document.getElementById("buttonOption");
const clientInfoDOM = document.getElementById("clientInfo");
const updateWorkDetailFormDOM = document.getElementById("updateWorkDetailForm");
const addWorkInfoPopupDOM = document.getElementById("addWorkInfoPopup");
const addWorkInfoFormDOM = document.getElementById("addWorkInfoForm");
const closeAddWorkInfoPopupDOM = document.getElementById(
  "closeAddWorkInfoPopup"
);
const addedItemDOM = document.getElementById("addedItem");
const addedDepthDOM = document.getElementById("addedDepth");
const addedWidthDOM = document.getElementById("addedWidth");
const addedLengthDOM = document.getElementById("addedLength");
const addedQuantityDOM = document.getElementById("addedQuantity");
const workOrderPopupDOM = document.getElementById("workOrderPopup");
// 잔재
// const addedRemnantDOM = document.getElementById("addedRemnant");
//#endregion update work-order

const dateChipDOM = document.getElementById("dateChip");
const dateDOM = dateChipDOM.querySelector("#date");

//#region update status variable
let isUpdate, isUpdating;
let isAdd, isAdded;
//#endregion update status variable

//#region sub-handler
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
//#endregion sub-handler

//#region sub-handler
async function clickItemHandler() {
  const id = this.dataset.id;
  const response = await FetchAPI.get(`/items/${id}`);
  if (response) {
    const data = await response.json();
    const workDetailDOM = orderPopupDetailsDOM.querySelector(
      "#workDetail:last-child"
    );
    const itemDOM = workDetailDOM.querySelector("input:first-child");
    itemDOM.value = data.item.name;
    itemDOM.dataset.id = data.item.id;
    itemsPopupDOM.classList.add("hidden");
  }
}
//#endregion sub-handler

//#region sub-handler
function bodyHandler(event) {
  if (isUpdate) {
    return;
  }

  const embeddedDOMs = contentDOM.querySelectorAll("#embedded");
  embeddedDOMs.forEach((embeddedDOM) => {
    embeddedDOM.classList.add("hidden");
  });

  if (event.target === workInfoPopupDOM) {
    return;
  }

  const paragraphDOM = workInfoPopupDOM.querySelector("#paragraph");
  if (event.target === paragraphDOM) {
    return;
  }

  const spanDOMs = workInfoPopupDOM.querySelectorAll("span");
  for (const spanDOM of spanDOMs) {
    if (event.target === spanDOM) {
      return;
    }
  }

  const divDOMs = workInfoPopupDOM.querySelectorAll("div");
  for (const divDOM of divDOMs) {
    if (event.target === divDOM) {
      return;
    }
  }

  bodyDOM.removeEventListener("click", bodyHandler);
  popupDOM.classList.remove("blur");
  workInfoPopupDOM.classList.remove("blur");
  navDOM.classList.remove("blur");
  headerDOM.classList.remove("blur");
  const workInfoDOMs = workInfosDOM.querySelectorAll("#workInfo");
  workInfoDOMs.forEach((workInfoDOM) => {
    workInfoDOM.remove();
  });
  urgentInfoDOM.classList.remove("update");
  commentInfoDOM.classList.remove("update");

  popupDOM.classList.add("hidden");
  workInfoPopupDOM.classList.add("hidden");
}
//#endregion sub-handler

//#region sub-handler
async function clientInfoUpdateHandler() {
  if (isUpdating) {
    return;
  }

  isUpdate = true;
  isUpdating = true;

  popupDOM.classList.remove("hidden");
  clientsPopupDOM.classList.remove("hidden");
  workInfoPopupDOM.classList.remove("clean");

  workInfoPopupDOM.classList.add("blur");
  headerDOM.classList.add("blur");
  navDOM.classList.add("blur");

  const response = await FetchAPI.get("/clients");
  if (response) {
    const data = await response.json();
    let html = "";

    for (const client of data.clients) {
      html += htmls.clientList(client);
    }

    clientsDOM.textContent = "";
    clientsDOM.insertAdjacentHTML("beforeend", html);

    const clientDOMs = clientsDOM.querySelectorAll("#client");
    clientDOMs.forEach((clientDOM) => {
      clientDOM.addEventListener("click", async () => {
        const client_id = clientDOM.dataset.id;

        const response = await FetchAPI.get(`/clients/${client_id}`);
        if (response) {
          isUpdating = false;

          const data = await response.json();

          const associationDOM = clientInfoDOM.querySelector("#association");
          associationDOM.textContent = data.client.association;

          const nameDOM = clientInfoDOM.querySelector("#name");
          nameDOM.textContent = data.client.name;

          const telephoneDOM = clientInfoDOM.querySelector("#telephone");
          telephoneDOM.textContent = data.client.telephone;

          const updatedClientDOM = workInfoPopupDOM.querySelector("#client");
          updatedClientDOM.dataset.is_updated = true;
          updatedClientDOM.dataset.id = data.client.id;

          workInfoPopupDOM.classList.remove("blur");
          clientsPopupDOM.classList.add("hidden");
          updatedClientDOM.classList.add("updated");
        }
      });
    });
  }
}
//#endregion sub-handler

//#region sub-handler
async function urgentInfoUpdateHandler() {
  if (isUpdating) {
    return;
  }
  isUpdate = true;
  isUpdating = true;

  popupDOM.classList.remove("hidden");
  urgentPopupDOM.classList.remove("hidden");
  workInfoPopupDOM.classList.remove("clean");

  workInfoPopupDOM.classList.add("blur");
  headerDOM.classList.add("blur");
  navDOM.classList.add("blur");
}
//#endregion sub-handler

//#region sub-handler
function commentInfoUpdateHandler() {
  if (isUpdating) {
    return;
  }
  isUpdate = true;
  isUpdating = true;

  const commentDOM = updateCommentFormDOM.querySelector("#comment");
  commentDOM.value = commentInfoDOM.querySelector("span").textContent;

  commentPopupDOM.classList.remove("hidden");
}
//#endregion sub-handler

//#region sub-handler
function workInfoUpdateHandler() {
  if (isUpdating) {
    return;
  }
  isUpdate = true;
  isUpdating = true;

  updateWorkDetailFormDOM.dataset.id = this.dataset.work_detail_id;

  workDetailPopupDOM.classList.remove("hidden");
  workInfoPopupDOM.classList.remove("clean");
  workInfoPopupDOM.classList.add("blur");

  const item = this.querySelector("#item").textContent;
  updatedItemDOM.value = item;
  updatedItemDOM.dataset.id = this.dataset.item_id;

  // secondary derived handler
  const updatedItemHandler = async () => {
    itemsPopupDOM.classList.remove("hidden");
    workDetailPopupDOM.classList.add("hidden");

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
      itemDOMs.forEach((itemDOM) => {
        // tertiary derived handler
        itemDOM.addEventListener("click", () => {
          updatedItemDOM.removeEventListener("focus", updatedItemHandler);

          workDetailPopupDOM.classList.remove("hidden");
          itemsPopupDOM.classList.add("hidden");

          const itemName = itemDOM.querySelector("#name").textContent;
          updatedItemDOM.value = itemName;
          updatedItemDOM.dataset.id = itemDOM.dataset.id;
        });
      });
    }
  };
  updatedItemDOM.addEventListener("focus", updatedItemHandler);

  const depth = this.querySelector("#depth").textContent;
  const width = this.querySelector("#width").textContent;
  const length = this.querySelector("#length").textContent;
  const quantity = this.querySelector("#quantity").textContent;
  updatedDepthDOM.value = depth;
  updatedWidthDOM.value = width;
  updatedLengthDOM.value = length;
  updatedQuantityDOM.value = quantity;

  // 잔재
  // const remnant = this.querySelector("#remnant").textContent;
  // updatedRemnantDOM.value = remnant;
}
//#endregion sub-handler

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

  const searchClient = searchClientDOM.value.replaceAll("*", "\\*");
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
  isUpdating = false;

  workInfoPopupDOM.classList.remove("blur");
  headerDOM.classList.remove("blur");
  navDOM.classList.remove("blur");

  clientsPopupDOM.classList.add("hidden");
};

const addHandler = async () => {
  itemsPopupDOM.classList.remove("hidden");
  searchItemPopupDOM.classList.remove("hidden");
  createItemPopupDOM.classList.add("hidden");
  const icon = newItemDOM.querySelector("i");
  icon.className = icon.className.replace("solid", "regular");

  // const workDetailDOM = orderPopupDetailsDOM.querySelector(
  //   "#workDetail:last-child"
  // );
  // if (workDetailDOM) {
  //   const itemDOM = workDetailDOM.querySelector("#item");
  //   if (!itemDOM.value) {
  //     alert("Item not found");
  //     return;
  //   }
  // }

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
  if (!workDetailDOMs.length) {
    alert("Work-detail not found");
    return;
  }

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

    // 잔재
    // const remnant = workDetailDOM.querySelector("#remnant").value;

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
  } else {
    return;
  }

  let client;
  response = await FetchAPI.get(`/clients/${workOrder.client_id}`);
  if (response) {
    const data = await response.json();
    client = data.client;
  } else {
    return;
  }

  for (const workDetailDOM of workDetailDOMs) {
    const itemDOM = workDetailDOM.querySelector("#item");
    const item_id = itemDOM.dataset.id;

    const depthDOM = workDetailDOM.querySelector("#depth");
    const depth = depthDOM.value;

    const widthDOM = workDetailDOM.querySelector("#width");
    const width = widthDOM.value;

    const lengthDOM = workDetailDOM.querySelector("#length");
    const length = lengthDOM.value;

    const quantityDOM = workDetailDOM.querySelector("#quantity");
    const quantity = quantityDOM.value;

    // 잔재
    // const remnantDOM = workDetailDOM.querySelector("#remnant");
    // const remnant = remnantDOM.value;

    response = await FetchAPI.post("/work-details", {
      work_order_id: workOrder.id,
      item_id,
      width,
      length,
      depth,
      quantity,
    });
    workOrderPopupDOM.classList.add("hidden");
  }

  const html = htmls.workOrderList(workOrder, client);
  contentDOM.insertAdjacentHTML("afterbegin", html);
  const newWorkOrderContainerDOM = contentDOM.querySelector(
    "#workOrderContainer:first-child"
  );
  newWorkOrderContainerDOM.addEventListener("click", workOrderContainerHandler);
  const rightDOM = newWorkOrderContainerDOM.querySelector("#right");
  rightDOM.addEventListener("click", rightHandler);
  const deleteDOM = newWorkOrderContainerDOM.querySelector("#delete");
  deleteDOM.addEventListener("click", deleteHandler);
  const updateDOM = newWorkOrderContainerDOM.querySelector("#update");
  updateDOM.addEventListener("click", updateHandler);
  popupDOM.classList.add("hidden");
};

const closeItemsPopupHandler = () => {
  if (isAdd) {
    isAdd = false;
    isUpdating = false;

    workInfoPopupDOM.classList.remove("blur");
    itemsPopupDOM.classList.add("hidden");
    return;
  }

  if (isUpdate) {
    workDetailPopupDOM.classList.remove("hidden");
    itemsPopupDOM.classList.add("hidden");
    return;
  }

  itemsPopupDOM.classList.add("hidden");
  const workDetailDOM = orderPopupDetailsDOM.querySelector(
    "#workDetail:last-child"
  );
  workDetailDOM.remove();
};

async function workOrderContainerHandler(event) {
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

  popupDOM.classList.remove("hidden", "blur");
  workInfoPopupDOM.classList.remove("hidden", "blur");

  navDOM.classList.add("blur");
  headerDOM.classList.add("blur");

  const paragraphDOM = workInfoPopupDOM.querySelector("#paragraph");
  paragraphDOM.textContent = "work info";

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
    completeInfoDOM.textContent = "";
    completeInfoDOM.insertAdjacentHTML("beforeend", html);

    html = `
    <div>
      <span>${workOrder.is_urgent ? "urgent" : ""}</span>
    </div>
    `;
    urgentInfoDOM.textContent = "";
    urgentInfoDOM.insertAdjacentHTML("beforeend", html);

    html = `
    <div>
      <span>${workOrder.comment}</span>
    </div>
    `;
    commentInfoDOM.textContent = "";
    commentInfoDOM.insertAdjacentHTML("beforeend", html);
  }

  const clientId = this.dataset.client_id;
  response = await FetchAPI.get(`/clients/${clientId}`);
  if (response) {
    const data = await response.json();

    const html = htmls.clientList(data.client);
    clientInfoDOM.textContent = "";
    clientInfoDOM.insertAdjacentHTML("beforeend", html);
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

function rightHandler() {
  bodyDOM.addEventListener("click", bodyHandler);

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

async function deleteHandler(event) {
  event.stopPropagation();

  if (!confirm("Delete forever?")) {
    return;
  }

  const id = this.dataset.id;
  const response = await FetchAPI.delete(`/work-orders/${id}`);
  if (response) {
    const data = await response.json();
    alert(data.message);
  }
}

async function updateHandler(event) {
  event.stopPropagation();

  popupDOM.classList.remove("hidden");
  workInfoPopupDOM.classList.remove("hidden");

  const embeddedDOMs = contentDOM.querySelectorAll("#embedded");
  embeddedDOMs.forEach((embeddedDOM) => {
    embeddedDOM.classList.add("hidden");
  });
  commentPopupDOM.classList.add("hidden");
  workDetailPopupDOM.classList.add("hidden");

  const paragraphDOM = workInfoPopupDOM.querySelector("#paragraph");
  paragraphDOM.textContent = "update work-info";

  const workOrderId = this.dataset.id;

  let response = await FetchAPI.get(`/work-orders/${workOrderId}`);
  if (response) {
    const data = await response.json();
    const workOrder = data.workOrder;

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
    completeInfoDOM.textContent = "";
    completeInfoDOM.insertAdjacentHTML("beforeend", html);

    html = `
    <div>
      <span>${workOrder.is_urgent ? "urgent" : ""}</span>
    </div>
    `;
    urgentInfoDOM.textContent = "";
    urgentInfoDOM.classList.add("update");
    urgentInfoDOM.insertAdjacentHTML("beforeend", html);
    urgentInfoDOM.addEventListener("click", urgentInfoUpdateHandler);
    updatedUrgentDOM.checked = workOrder.is_urgent;

    html = `
    <div>
      <span>${workOrder.comment}</span>
    </div>
    `;
    commentInfoDOM.textContent = "";
    commentInfoDOM.insertAdjacentHTML("beforeend", html);
    commentInfoDOM.addEventListener("click", commentInfoUpdateHandler);
    commentInfoDOM.classList.add("update");
  }

  const clientId = this.dataset.client_id;
  response = await FetchAPI.get(`/clients/${clientId}`);
  if (response) {
    const data = await response.json();

    const html = htmls.clientList(data.client);
    clientInfoDOM.textContent = "";
    clientInfoDOM.insertAdjacentHTML("beforeend", html);
    clientInfoDOM.addEventListener("click", clientInfoUpdateHandler);
    const clientDOM = clientInfoDOM.querySelector("#client");
    clientDOM.classList.add("update");
  }

  response = await FetchAPI.get(`/work-orders/${workOrderId}/details`);
  if (response) {
    const data = await response.json();

    let html = "";
    for (const workDetail of data.workDetails) {
      const itemId = workDetail.item_id;
      const response = await FetchAPI.get(`/items/${itemId}`);
      if (response) {
        const data = await response.json();
        const item = data.item;
        const workInfo = { workDetail, item };
        html += htmls.workInfoList(workInfo);
      }
    }

    html += `
    <div class='add-row'>
      <button id='addWorkInfo'>add</button>
    </div>
    `;
    workInfosDOM.textContent = "";
    workInfosDOM.insertAdjacentHTML("beforeend", html);
    const addWorkInfoDOM = workInfosDOM.querySelector("#addWorkInfo");
    addWorkInfoDOM.addEventListener("click", async (event) => {
      event.stopPropagation();

      if (isUpdating) {
        return;
      }
      isUpdate = true;
      isUpdating = true;
      isAdd = true;

      addedDepthDOM.value = "";
      addedWidthDOM.value = "";
      addedLengthDOM.value = "";
      addedQuantityDOM.value = "";

      workInfoPopupDOM.classList.remove("clean");
      itemsPopupDOM.classList.remove("hidden");
      workInfoPopupDOM.classList.add("blur");

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
        itemDOMs.forEach((itemDOM) => {
          itemDOM.addEventListener("click", () => {
            addWorkInfoPopupDOM.classList.remove("hidden");
            itemsPopupDOM.classList.add("hidden");

            const itemName = itemDOM.querySelector("#name").textContent;
            addedItemDOM.value = itemName;
            addedItemDOM.dataset.id = itemDOM.dataset.id;
          });
        });
      }
    });

    const workInfoDOMs = workInfosDOM.querySelectorAll("#workInfo");
    workInfoDOMs.forEach((workInfoDOM) => {
      workInfoDOM.classList.add("update");

      // primary derived handler
      workInfoDOM.addEventListener("click", workInfoUpdateHandler);
    });
  }

  const html = `
  <div class="update-button">
      <div class="center">
          <button id="updateWorkInfo">update</button>
      </div>
  </div>
  `;
  buttonOptionDOM.textContent = "";
  buttonOptionDOM.insertAdjacentHTML("beforeend", html);
  const updateWorkInfoDOM = buttonOptionDOM.querySelector("#updateWorkInfo");
  updateWorkInfoDOM.addEventListener("click", async (event) => {
    event.stopPropagation();

    if (isAdded) {
      const workInfoDOMs = workInfosDOM.querySelectorAll("#workInfo");
      for (const workInfoDOM of workInfoDOMs) {
        if (!workInfoDOM.dataset.work_detail_id) {
          const work_order_id = workInfoDOM.dataset.work_order_id;
          const item_id = workInfoDOM.dataset.item_id;
          const depth = workInfoDOM.querySelector("#depth").textContent;
          const width = workInfoDOM.querySelector("#width").textContent;
          const length = workInfoDOM.querySelector("#length").textContent;
          const quantity = workInfoDOM.querySelector("#quantity").textContent;
          // 잔재
          // const remnant = workInfoDOM.querySelector("#remnant");

          const workDetail = {
            work_order_id,
            item_id,
            depth,
            width,
            length,
            quantity,
          };
          const response = await FetchAPI.post(`/work-details`, workDetail);
          if (!response) {
            return;
          }
        }
      }
      isAdded = false;
    }

    if (!isUpdate) {
      alert("Updated not found");
      return;
    }

    const updatedClientDOM = workInfoPopupDOM.querySelector("#client");
    const isUpdatedClient = updatedClientDOM.dataset.is_updated === "true";

    const workOrder = { id: workOrderId, payload: {} };
    if (isUpdatedClient) {
      workOrder.payload.client_id = updatedClientDOM.dataset.id;
    }

    const isUpdatedComment = commentInfoDOM.dataset.is_updated === "true";
    if (isUpdatedComment) {
      workOrder.payload.comment =
        commentInfoDOM.querySelector("span").textContent;
    }

    const isUpdatedUrgent = urgentInfoDOM.dataset.is_updated === "true";
    if (isUpdatedUrgent) {
      const isUrgent = urgentInfoDOM.dataset.is_urgent === "true";

      if (isUrgent) {
        workOrder.payload.is_urgent = true;
      } else {
        workOrder.payload.is_urgent = false;
      }
    }

    const workDetails = [{ id: null, payload: {} }];
    const workInfoDOMs = workInfosDOM.querySelectorAll("#workInfo");
    for (const workInfoDOM of workInfoDOMs) {
      const isUpdatedWorkInfo = workInfoDOM.dataset.is_updated === "true";
      if (isUpdatedWorkInfo) {
        const workDetail = {
          id: workInfoDOM.dataset.work_detail_id,
          payload: {},
        };
        const itemDOM = workInfoDOM.querySelector("#item");
        const isDuplicate = workInfoDOM.dataset.item_id === itemDOM.dataset.id;
        if (!isDuplicate) {
          workDetail.payload.item_id = itemDOM.dataset.id;
        }

        const depthDOM = workInfoDOM.querySelector("#depth");
        workDetail.payload.depth = depthDOM.textContent;

        const widthDOM = workInfoDOM.querySelector("#width");
        workDetail.payload.width = widthDOM.textContent;

        const lengthDOM = workInfoDOM.querySelector("#length");
        workDetail.payload.length = lengthDOM.textContent;

        const quantityDOM = workInfoDOM.querySelector("#quantity");
        workDetail.payload.quantity = quantityDOM.textContent;

        // workDetail.payload.remnant = workInfoDOM.querySelector("#remnant").textContent;
        workDetails.push(workDetail);
      }
    }

    const updatedWorkDetailsExist = workDetails.length > 1;
    if (updatedWorkDetailsExist) {
      workDetails.forEach(async (workDetail, i) => {
        if (i === 0) {
          return;
        }
        await FetchAPI.patch(
          `/work-details/${workDetail.id}`,
          workDetail.payload
        );
      });
    }

    const keys = Object.keys(workOrder.payload);
    const updatedWorkOrderExists = keys.length;
    if (updatedWorkOrderExists) {
      const response = await FetchAPI.patch(
        `/work-orders/${workOrder.id}`,
        workOrder.payload
      );
      if (response) {
        const data = await response.json();
        const workOrderId = data.workOrder.id;

        const workOrderContainerDOMs = contentDOM.querySelectorAll(
          "#workOrderContainer"
        );
        workOrderContainerDOMs.forEach((workOrderContainerDOM) => {
          if (workOrderContainerDOM.dataset.id === workOrderId) {
            keys.forEach(async (key) => {
              if (key === "is_urgent") {
                const isUrgent = data.workOrder.is_urgent;

                workOrderContainerDOM.dataset.is_urgent = isUrgent;
                const urgentDOM =
                  workOrderContainerDOM.querySelector("#urgent");
                urgentDOM.textContent = isUrgent ? "urgent" : "";
              }

              if (key === "client_id") {
                const clientId = data.workOrder.client_id;
                const response = await FetchAPI.get(`/clients/${clientId}`);
                if (response) {
                  const data = await response.json();

                  const associationDOM =
                    workOrderContainerDOM.querySelector("#association");
                  associationDOM.textContent = data.client.association;

                  const nameDOM = workOrderContainerDOM.querySelector("#name");
                  nameDOM.textContent = data.client.name;

                  workOrderContainerDOM.dataset.client_id = data.client.id;
                  const updateDOM =
                    workOrderContainerDOM.querySelector("#update");
                  updateDOM.dataset.client_id = data.client.id;
                }
              }

              if (key === "comment") {
                const comment = data.workOrder.comment;
                const commentDOM =
                  workOrderContainerDOM.querySelector("#comment");
                commentDOM.textContent = comment;
              }
            });
          }
        });
      }
    }

    isUpdate = false;
    popupDOM.classList.remove("clean");
    popupDOM.classList.add("hidden");
    workInfoPopupDOM.classList.add("hidden");
  });
}

const closeWorkInfoPopupHandler = () => {
  bodyDOM.removeEventListener("click", bodyHandler);

  popupDOM.classList.add("hidden");
  workInfoPopupDOM.classList.add("hidden");
  commentInfoDOM.classList.remove("updated");
};

const createClientFormHandler = async (event) => {
  event.preventDefault();

  const association = associationDOM.value;
  const name = nameDOM.value;
  const telephone = telephoneDOM.value;
  const comment = clientCommentDOM.value;

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
    comment: comment ? comment : "",
  });
  if (response) {
    const data = await response.json();
    const html = htmls.clientList(data.client);
    clientsDOM.insertAdjacentHTML("afterbegin", html);
    const clientDOM = clientsDOM.querySelector("#client:first-child");
    clientDOM.addEventListener("click", clickClientHandler);

    associationDOM.value = "";
    nameDOM.value = "";
    telephoneDOM.value = "";
    clientCommentDOM.value = "";
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

const workInfoPopupHandler = (event) => {
  if (isUpdate) {
    return;
  }

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
  if (isESC) {
    isUpdate = false;

    bodyDOM.removeEventListener("click", bodyHandler);
    popupDOM.classList.remove("blur");
    workInfoPopupDOM.classList.remove("blur");
    navDOM.classList.remove("blur");
    headerDOM.classList.remove("blur");
    urgentPopupDOM.classList.remove("blur");
    urgentInfoDOM.classList.remove("update");
    commentInfoDOM.classList.remove("updated");

    const workInfoDOMs = workInfosDOM.querySelectorAll("#workInfo");
    workInfoDOMs.forEach((workInfoDOM) => {
      workInfoDOM.remove();
    });

    popupDOM.classList.add("hidden");
    workInfoPopupDOM.classList.add("hidden");
    itemsPopupDOM.classList.add("hidden");
    clientsPopupDOM.classList.add("hidden");
    urgentPopupDOM.classList.add("hidden");

    const embeddedDOMs = contentDOM.querySelectorAll("#embedded");
    embeddedDOMs.forEach((embeddedDOM) => {
      embeddedDOM.classList.add("hidden");
    });
  }
};

const closeUrgentPopupHandler = () => {
  isUpdating = false;

  workInfoPopupDOM.classList.remove("blur");
  headerDOM.classList.remove("blur");
  navDOM.classList.remove("blur");

  urgentPopupDOM.classList.add("hidden");
};

const updatedUrgentHandler = () => {
  isUpdating = false;

  const spanDOM = urgentInfoDOM.querySelector("span");
  spanDOM.textContent = updatedUrgentDOM.checked ? "urgent" : "";
  urgentInfoDOM.dataset.is_updated = true;
  urgentInfoDOM.dataset.is_urgent = updatedUrgentDOM.checked;

  workInfoPopupDOM.classList.remove("blur");

  urgentPopupDOM.classList.add("hidden");
  urgentInfoDOM.classList.add("updated");
};

const closeWorkDetailPopupHandler = () => {
  isUpdating = false;

  workDetailPopupDOM.classList.add("hidden");
  workInfoPopupDOM.classList.remove("blur");
};

const closeCommentPopupHandler = () => {
  isUpdating = false;

  commentPopupDOM.classList.add("hidden");
};

const updateCommentFormHandler = (event) => {
  event.preventDefault();

  isUpdating = false;

  const workCommentDOM = commentPopupDOM.querySelector("#comment");
  const commentSpan = workInfoPopupDOM.querySelector("#commentInfo span");
  commentSpan.textContent = workCommentDOM.value;
  workCommentDOM.value = "";

  commentInfoDOM.dataset.is_updated = true;

  commentPopupDOM.classList.add("hidden");
  commentInfoDOM.classList.add("updated");
};

const updateWorkDetailFormHandler = (event) => {
  event.preventDefault();

  workInfoPopupDOM.classList.remove("blur");

  const item = updatedItemDOM.value;
  const depth = updatedDepthDOM.value;
  const width = updatedWidthDOM.value;
  const length = updatedLengthDOM.value;
  const quantity = updatedQuantityDOM.value;
  const remnant = updatedRemnantDOM.value;

  if (!item) {
    alert("Item not found");
    updatedItemDOM.focus();
    return;
  }

  if (!depth) {
    alert("Depth not found");
    updatedDepthDOM.focus();
    return;
  }

  if (!width) {
    alert("Width not found");
    updatedWidthDOM.focus();
    return;
  }

  if (!length) {
    alert("Length not found");
    updatedLengthDOM.focus();
    return;
  }

  if (!quantity) {
    alert("quantity not found");
    updatedQuantityDOM.focus();
    return;
  }

  // 잔재
  // if (!remnant) {
  //   updatedRemnantDOM.focus();
  //   alert("Remnant not found");
  //   return;
  // }
  const workInfoDOMs = workInfosDOM.querySelectorAll("#workInfo");
  workInfoDOMs.forEach((workInfoDOM) => {
    const workDetailId = updateWorkDetailFormDOM.dataset.id;
    if (workInfoDOM.dataset.work_detail_id === workDetailId) {
      const itemDOM = workInfoDOM.querySelector("#item");
      itemDOM.textContent = updatedItemDOM.value;
      itemDOM.dataset.id = updatedItemDOM.dataset.id;

      const depthDOM = workInfoDOM.querySelector("#depth");
      depthDOM.textContent = updatedDepthDOM.value;

      const widthDOM = workInfoDOM.querySelector("#width");
      widthDOM.textContent = updatedWidthDOM.value;

      const lengthDOM = workInfoDOM.querySelector("#length");
      lengthDOM.textContent = updatedLengthDOM.value;

      const quantityDOM = workInfoDOM.querySelector("#quantity");
      quantityDOM.textContent = updatedQuantityDOM.value;

      // 잔재
      // const remnantDOM = workInfoDOM.querySelector("#remnant");
      // remnantDOM.textContent = updatedRemnantDOM.value;

      workInfoDOM.classList.add("updated");
      if (workInfoDOM.dataset.work_detail_id) {
        workInfoDOM.dataset.is_updated = true;
      }
    }
  });

  isUpdating = false;

  workDetailPopupDOM.classList.add("hidden");
};

const addWorkInfoFormHandler = (event) => {
  event.preventDefault();

  isAdd = false;
  isUpdating = false;

  let workInfoDOMs = workInfosDOM.querySelectorAll("#workInfo");
  const lastWorkInfoDOM = workInfoDOMs[workInfoDOMs.length - 1];
  const work_order_id = workInfoDOMs[0].dataset.work_order_id;
  const addedItem = addedItemDOM.value;
  const addedDepth = addedDepthDOM.value;
  const addedWidth = addedWidthDOM.value;
  const addedLength = addedLengthDOM.value;
  const addedQuantity = addedQuantityDOM.value;
  // 잔재
  // const addedRemnant = addedRemnantDOM.value;
  if (!addedItem) {
    alert("Provide item");
    addedItemDOM.focus();
    return;
  }

  if (!addedDepth) {
    alert("Provide depth");
    addedDepthDOM.focus();
    return;
  }

  if (!addedWidth) {
    alert("Provide depth");
    addedWidthDOM.focus();
    return;
  }

  if (!addedLength) {
    alert("Provide depth");
    addedLengthDOM.focus();
    return;
  }

  if (!addedQuantity) {
    alert("Provide depth");
    addedQuantityDOM.focus();
    return;
  }

  const item = { id: addedItemDOM.dataset.id, name: addedItem };
  const workDetail = {
    id: "",
    work_order_id,
    depth: addedDepth,
    width: addedWidth,
    length: addedLength,
    quantity: addedQuantity,
    /* remnant */
  };

  const workInfo = { item, workDetail };
  const html = htmls.workInfoList(workInfo);
  lastWorkInfoDOM.insertAdjacentHTML("afterend", html);

  workInfoDOMs = workInfosDOM.querySelectorAll("#workInfo");
  const addedWorkInfoDOM = workInfoDOMs[workInfoDOMs.length - 1];
  addedWorkInfoDOM.addEventListener("click", workInfoUpdateHandler);
  addedWorkInfoDOM.classList.add("update", "updated");

  isAdded = true;

  workInfoPopupDOM.classList.remove("blur");
  addWorkInfoPopupDOM.classList.add("hidden");
};

const closeAddWorkInfoPopupHandler = () => {
  isUpdating = false;
  isAdd = false;

  addWorkInfoPopupDOM.classList.add("hidden");
  workInfoPopupDOM.classList.remove("blur");
};

closeAddWorkInfoPopupDOM.addEventListener(
  "click",
  closeAddWorkInfoPopupHandler
);

const dateHandler = async () => {
  let workOrderContainerDOMs = document.querySelectorAll("#workOrderContainer");
  workOrderContainerDOMs = document.querySelectorAll("#workOrderContainer");
  workOrderContainerDOMs.forEach((workOrderContainerDOM) => {
    workOrderContainerDOM.remove();
  });

  const date = dateDOM.value;
  const response = await FetchAPI.post("/work-orders/date", {
    created_at: date,
  });
  if (response) {
    const data = await response.json();

    data.workOrders.forEach(async (workOrder) => {
      const response = await FetchAPI.get(`/clients/${workOrder.client_id}`);
      if (response) {
        const data = await response.json();
        const html = htmls.workOrderList(workOrder, data.client);
        contentDOM.insertAdjacentHTML("beforeend", html);
        workOrderContainerDOMs = document.querySelectorAll(
          "#workOrderContainer"
        );
        workOrderContainerDOMs.forEach((workOrderContainerDOM) => {
          workOrderContainerDOM.addEventListener(
            "click",
            workOrderContainerHandler
          );
          const rightDOM = workOrderContainerDOM.querySelector("#right");
          rightDOM.addEventListener("click", rightHandler);
          const deleteDOM = workOrderContainerDOM.querySelector("#delete");
          deleteDOM.addEventListener("click", deleteHandler);
          const updateDOM = workOrderContainerDOM.querySelector("#update");
          updateDOM.addEventListener("click", updateHandler);
        });
      }
    });
  }
};

dateDOM.addEventListener("change", dateHandler);
addWorkInfoFormDOM.addEventListener("submit", addWorkInfoFormHandler);
updateWorkDetailFormDOM.addEventListener("submit", updateWorkDetailFormHandler);
updateCommentFormDOM.addEventListener("submit", updateCommentFormHandler);
closeCommentPopupDOM.addEventListener("click", closeCommentPopupHandler);
closeWorkDetailPopupDOM.addEventListener("click", closeWorkDetailPopupHandler);
updatedUrgentDOM.addEventListener("change", updatedUrgentHandler);
closeUrgentPopupDOM.addEventListener("click", closeUrgentPopupHandler);
document.addEventListener("keydown", docsHandler);
workInfoPopupDOM.addEventListener("mouseenter", workInfoPopupHandler);
workInfoPopupDOM.addEventListener("mouseleave", workInfoPopupHandler);
newClientDOM.addEventListener("click", newClientHandler);
createClientFormDOM.addEventListener("submit", createClientFormHandler);
closeWorkInfoPopupDOM.addEventListener("click", closeWorkInfoPopupHandler);
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

    const rightDOM = workOrderContainerDOM.querySelector("#right");
    rightDOM.addEventListener("click", rightHandler);
    const deleteDOM = workOrderContainerDOM.querySelector("#delete");
    deleteDOM.addEventListener("click", deleteHandler);
    const updateDOM = workOrderContainerDOM.querySelector("#update");
    updateDOM.addEventListener("click", updateHandler);

    const id = workOrderContainerDOM.dataset.client_id;
    const response = await FetchAPI.get(`/clients/${id}`);
    if (response) {
      const data = await response.json();
      const html = htmls.clientPreview(data.client);
      const clientDOM = workOrderContainerDOM.querySelector("#client");
      clientDOM.insertAdjacentHTML("beforeend", html);
    }
  });
})();
