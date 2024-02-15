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
const itemDOM = document.getElementById("item");
const depthDOM = document.getElementById("depth");
const widthDOM = document.getElementById("width");
const lengthDOM = document.getElementById("length");
const quantityDOM = document.getElementById("quantity");
const remnantDOM = document.getElementById("remnant");
const updateWorkDetailDOM = document.getElementById("updateWorkDetail");
// const columnsDOM = document.getElementById("columns");
const commentPopupDOM = document.getElementById("commentPopup");
const closeCommentPopupDOM = document.getElementById("closeCommentPopup");
const updateCommentFormDOM = document.getElementById("updateCommentForm");
const urgentInfoDOM = document.getElementById("urgentInfo");
const commentInfoDOM = document.getElementById("commentInfo");
const completeInfoDOM = document.getElementById("completeInfo");
const buttonOptionDOM = document.getElementById("buttonOption");
const clientInfoDOM = document.getElementById("clientInfo");
const updateWorkDetailFormDOM = document.getElementById("updateWorkDetailForm");
//#endregion update work-order

//#region status variable
let isUpdate;
//#endregion status variable

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

async function clientInfoUpdateHandler() {
  isUpdate = true;

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
          const data = await response.json();

          const associationDOM = clientInfoDOM.querySelector("#association");
          associationDOM.textContent = data.client.association;
          const nameDOM = clientInfoDOM.querySelector("#name");
          nameDOM.textContent = data.client.name;
          const telephoneDOM = clientInfoDOM.querySelector("#telephone");
          telephoneDOM.textContent = data.client.telephone;
          const updatedClientDOM = workInfoPopupDOM.querySelector("#client");
          updatedClientDOM.dataset.id = data.client.id;

          workInfoPopupDOM.classList.remove("blur");
          clientsPopupDOM.classList.add("hidden");
          updatedClientDOM.classList.add("updated");
        }
      });
    });
  }
}

async function urgentInfoUpdateHandler() {
  isUpdate = true;

  popupDOM.classList.remove("hidden");
  urgentPopupDOM.classList.remove("hidden");
  workInfoPopupDOM.classList.remove("clean");

  workInfoPopupDOM.classList.add("blur");
  headerDOM.classList.add("blur");
  navDOM.classList.add("blur");
}

function commentInfoHandler() {
  isUpdate = true;

  commentPopupDOM.classList.remove("hidden");
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

    // 잔재 관련 기능 추가
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

    // 잔재 관련 기능 추가
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
  const newWorkOrderContainerDOM = contentDOM.querySelector(
    "#workOrderContainer:first-child"
  );
  newWorkOrderContainerDOM.addEventListener("click", workOrderContainerHandler);
  popupDOM.classList.add("hidden");
};

const closeItemsPopupHandler = () => {
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
    commentInfoDOM.classList.add("update");
    commentInfoDOM.insertAdjacentHTML("beforeend", html);
    commentInfoDOM.addEventListener("click", commentInfoHandler);
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
    workInfosDOM.textContent = "";
    workInfosDOM.insertAdjacentHTML("beforeend", html);
    const workInfoDOMs = workInfosDOM.querySelectorAll("#workInfo");
    workInfoDOMs.forEach((workInfoDOM, i) => {
      workInfoDOM.classList.add("update");

      workInfoDOM.addEventListener("click", () => {
        isUpdate = true;

        workDetailPopupDOM.classList.remove("hidden");
        workInfoPopupDOM.classList.remove("clean");
        workInfoPopupDOM.classList.add("blur");

        const item = workInfoDOM.querySelector("#item").textContent;
        itemDOM.value = item;
        itemDOM.addEventListener("focus", async () => {
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
              itemDOM.addEventListener("click", () => {
                workDetailPopupDOM.classList.remove("hidden");
                itemsPopupDOM.classList.add("hidden");

                const itemName = itemDOM.querySelector("#name").textContent;
                console.log(itemName);
              });
            });
          }
        });

        const depth = workInfoDOM.querySelector("#depth").textContent;
        let html = `
        <span>depth</span>
        <div>
          <input type="text" value='${depth}'>
        </div>
        `;
        depthDOM.textContent = "";
        depthDOM.insertAdjacentHTML("beforeend", html);

        const width = workInfoDOM.querySelector("#width").textContent;
        html = `
        <span>width</span>
        <div>
          <input type="text" value='${width}'>
        </div>
        `;
        widthDOM.textContent = "";
        widthDOM.insertAdjacentHTML("beforeend", html);

        const length = workInfoDOM.querySelector("#length").textContent;
        html = `
        <span>length</span>
        <div>
          <input type="text" value='${length}'>
        </div>
        `;
        lengthDOM.textContent = "";
        lengthDOM.insertAdjacentHTML("beforeend", html);

        const quantity = workInfoDOM.querySelector("#quantity").textContent;
        html = `
        <span>quantity</span>
        <div>
          <input type="text" value='${quantity}'>
        </div>
        `;
        quantityDOM.textContent = "";
        quantityDOM.insertAdjacentHTML("beforeend", html);

        html = `
        <span>remnant</span>
        <div>
          <input type="text">
        </div>
        `;
        remnantDOM.textContent = "";
        remnantDOM.insertAdjacentHTML("beforeend", html);
        // columnsDOM.dataset.index = i;
      });
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

    // TODO
    // if (!isUpdate) {
    //   alert("Updated not found");
    //   return;
    // }
    const updatedClientDOM = workInfoPopupDOM.querySelector("#client");
    const comment = commentInfoDOM.querySelector("span").textContent;
    const client_id = updatedClientDOM.dataset.id;

    // await FetchAPI.patch(`/work-orders/${workOrderId}`);

    console.log(client_id, updatedUrgentDOM.checked, comment);
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
  workInfoPopupDOM.classList.remove("blur");
  headerDOM.classList.remove("blur");
  navDOM.classList.remove("blur");

  urgentPopupDOM.classList.add("hidden");
};

const updatedUrgentHandler = () => {
  const spanDOM = urgentInfoDOM.querySelector("span");
  spanDOM.textContent = updatedUrgentDOM.checked ? "urgent" : "";

  workInfoPopupDOM.classList.remove("blur");

  urgentPopupDOM.classList.add("hidden");
  urgentInfoDOM.classList.add("updated");
};

const closeWorkDetailPopupHandler = () => {
  workDetailPopupDOM.classList.add("hidden");
  workInfoPopupDOM.classList.remove("blur");
};

const closeCommentPopupHandler = () => {
  commentPopupDOM.classList.add("hidden");
};

const updateCommentFormHandler = (event) => {
  event.preventDefault();

  const workCommentDOM = commentPopupDOM.querySelector("#comment");
  const commentSpan = workInfoPopupDOM.querySelector("#commentInfo span");
  commentSpan.textContent = workCommentDOM.value;
  workCommentDOM.value = "";
  commentPopupDOM.classList.add("hidden");
  commentInfoDOM.classList.add("updated");
};

const updateWorkDetailFormHandler = (event) => {
  event.preventDefault();

  workInfoPopupDOM.classList.remove("blur");

  const itemInput = itemDOM.querySelector("input");
  const item = itemInput.value;
  const depthInput = depthDOM.querySelector("input");
  const depth = depthInput.value;
  const widthInput = widthDOM.querySelector("input");
  const width = widthInput.value;
  const lengthInput = lengthDOM.querySelector("input");
  const length = lengthInput.value;
  const quantityInput = quantityDOM.querySelector("input");
  const quantity = quantityInput.value;
  const remnantInput = remnantDOM.querySelector("input");
  const remnant = remnantInput.value;

  if (!item) {
    alert("Item not found");
    itemInput.focus();
    return;
  }

  if (!depth) {
    alert("Depth not found");
    depthInput.focus();
    return;
  }

  if (!width) {
    alert("Width not found");
    widthInput.focus();
    return;
  }

  if (!length) {
    alert("Length not found");
    lengthInput.focus();
    return;
  }

  if (!quantity) {
    alert("quantity not found");
    quantityInput.focus();
    return;
  }

  // 잔재
  // if (!remnant) {
  //   remnantInput.focus();
  //   alert("Remnant not found");
  //   return;
  // }
  // const index = columnsDOM.dataset.index;
  const workInfoDOMs = workInfosDOM.querySelectorAll("#workInfo");
  // workInfoDOMs[index].querySelector("#item").textContent = item;
  // workInfoDOMs[index].querySelector("#depth").textContent = depth;
  // workInfoDOMs[index].querySelector("#width").textContent = width;
  // workInfoDOMs[index].querySelector("#length").textContent = length;
  // workInfoDOMs[index].querySelector("#quantity").textContent = quantity;
  // workInfoDOMs[index].querySelector("#remnant").textContent = remnant;

  workDetailPopupDOM.classList.add("hidden");
  // workInfoDOMs[index].classList.add("updated");
};

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
