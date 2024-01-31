import FetchAPI from "../fetch-api";

const clientsDOM = document.getElementById("clients");
const searchClientsDOM = document.getElementById("searchClients");
const clientsPopupDOM = document.getElementById("clientsPopup");
const selectedClientDOM = document.getElementById("selectedClient");
const closeClientsPopupDOM = document.getElementById("closeClientsPopup");
const searchClientDOM = document.getElementById("searchClient");
const searchClientFormDOM = document.getElementById("searchClientForm");
const addDOM = document.getElementById("add");
const orderPopupDetailsDOM = document.querySelector(
  "#workOrderPopup #workDetails"
);
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
const detailPopupDetailsDOM = document.querySelector(
  "#workDetailPopup #workDetails"
);
const bodyDOM = document.querySelector("body");
const newItemDOM = document.getElementById("newItem");

const itemList = (item) => {
  return `
  <div data-id=${item.id} id='item'>
    <span id='name'>${item.name}</span>
  </div>
  `;
};

const clientList = (client) => {
  return `
  <div data-id=${client.id} id='client'>
    <span id='association'>${client.association}</span>
    <span id='name'>${client.name}</span>
    <span id='telephone'>${client.telephone}</span>
  </div>
  `;
};

const workDetailList = (workDetail) => {
  return `
  <div id='workDetail'>
    <div>
      <span>item</span>
      <span>${workDetail.itemName}</span>
    </div>
    <div>
      <span>depth</span>
      <span>${workDetail.depth}</span>
    </div>
    <div>
      <span>size</span>
      <span>${workDetail.width}</span>
      <span>x</span>
      <span>${workDetail.length}</span>
    </div>
    <div>
      <span>quantity</span>
      <span>${workDetail.quantity}</span>
    </div>
    <div>
      <span>comment</span>
      <span>${workDetail.workOrderComment}</span>
    </div>
  </div>
  `;
};

async function clickClientHandler() {
  const id = this.dataset.id;
  const response = await FetchAPI.get(`/clients/${id}`);
  if (response) {
    const data = await response.json();
    selectedClientDOM.value = data.client.association;
    selectedClientDOM.dataset.id = data.client.id;
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
}

const searchClientsHandler = async () => {
  if (clientsPopupDOM.classList.contains("hidden")) {
    clientsPopupDOM.classList.remove("hidden");

    const response = await FetchAPI.get("/clients");
    if (response) {
      const data = await response.json();
      let html = "";

      for (const client of data.clients) {
        html += clientList(client);
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

  const html = `
  <div class='work-detail' id='workDetail'>
    <div>
      <input type='text' id='item'>
    </div>
    <div>
      <input type='text' id='depth'>
    </div>
    <div>
      <input type='text' id='width'>
    </div>
    <div>
      <input type='text' id='length'>
    </div>
    <div>
      <input type='text' id='quantity'>
    </div>
    <div>
      <input type='text' id='remnant'>
    </div>
    <div>
      <button id='delete'>delete</button>
    </div>
  </div>
  `;
  orderPopupDetailsDOM.insertAdjacentHTML("beforeend", html);

  const newWorkDetailDOM = orderPopupDetailsDOM.querySelector(
    "#workDetail:last-child"
  );
  const itemDOM = newWorkDetailDOM.querySelector("#item");
  itemDOM.addEventListener("focus", async () => {
    const response = await FetchAPI.get("/items");
    if (response) {
      itemsPopupDOM.classList.remove("hidden");
      const icon = newItemDOM.querySelector("i");
      icon.className = icon.className.replace("solid", "regular");

      const data = await response.json();
      let html = "";

      for (const item of data.items) {
        html += itemList(item);
      }
      itemsDOM.textContent = "";
      itemsDOM.insertAdjacentHTML("beforeend", html);

      const itemDOMs = itemsDOM.querySelectorAll("#item");
      for (const itemDOM of itemDOMs) {
        itemDOM.addEventListener("click", clickItemHandler);
      }
    }
  });
  const deleteDOM = newWorkDetailDOM.querySelector("#delete");
  deleteDOM.addEventListener("click", () => {
    newWorkDetailDOM.remove();
  });

  const response = await FetchAPI.get("/items");
  if (response) {
    const data = await response.json();
    let html = "";

    for (const item of data.items) {
      html += itemList(item);
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
  const client_id = selectedClientDOM.dataset.id;
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

  const workDetailDOMs = orderPopupDetailsDOM.querySelectorAll("#workDetail");
  for (const workDetailDOM of workDetailDOMs) {
    const item_id = workDetailDOM.querySelector("#item").dataset.id;
    const depth = workDetailDOM.querySelector("#depth").value;
    const width = workDetailDOM.querySelector("#width").value;
    const length = workDetailDOM.querySelector("#length").value;
    const quantity = workDetailDOM.querySelector("#quantity").value;

    // TODO: 잔재 관련 기능 추가
    const remnant = workDetailDOM.querySelector("#remnant").value;

    if (!item_id || !depth || !width || !length || !quantity) {
      alert("Provide all values");
      return;
    }

    let clientHtml;
    response = await FetchAPI.get(`/clients/${workOrder.client_id}`);
    if (response) {
      const data = await response.json();
      clientHtml = `
      <div>
        <span>${data.client.association}</span>
      </div>
      <div>
        <span>${data.client.name}</span>
      </div>
      `;
    }

    response = await FetchAPI.post("/work-details", {
      work_order_id: workOrder.id,
      item_id,
      width,
      length,
      depth,
      quantity,
    });

    if (response) {
      const html = `
      <div class="work-order-container" id="workOrderContainer" data-client_id="${
        workOrder.client_id
      }" data-is_complete="${workOrder.is_complete}" data-is_urgent="${
        workOrder.is_urgent
      }">
        <div>
          <div>
              <span>${workOrder.is_complete ? "complete" : "resolving"}</span>
          </div>
          <div>
              <span>${workOrder.is_urgent ? "urgent" : ""}</span>
          </div>
        </div>
        <div id="client">${clientHtml}</div>
        <div>
          <span>생성일자 ${workOrder.created_at}</span>
        </div>
      </div>
      `;
      contentDOM.insertAdjacentHTML("afterbegin", html);
    }
  }

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
  const workOrderId = this.dataset.id;

  let workOrderComment;
  let response = await FetchAPI.get(`/work-orders/${workOrderId}`);
  if (response) {
    const data = await response.json();
    workOrderComment = data.workOrder.comment;
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
        workDetail.itemName = data.item.name;
        workDetail.workOrderComment = workOrderComment;
        html += workDetailList(workDetail);
      }
    }

    detailPopupDetailsDOM.textContent = "";
    detailPopupDetailsDOM.insertAdjacentHTML("beforeend", html);
  }

  const clientId = this.dataset.client_id;
  response = await FetchAPI.get(`/clients/${clientId}`);
  if (response) {
    const data = await response.json();
    const clientDOM = workDetailPopupDOM.querySelector("#client");
    const html = `
    <div>
      <span>association: ${data.client.association}</span>
    </div>
    <div>
      <span>name: ${data.client.name}</span>
    </div>
    <div>
      <span>telephone: ${data.client.telephone}</span>
    </div>
    `;
    clientDOM.textContent = "";
    clientDOM.insertAdjacentHTML("beforeend", html);
  }
}

const closeWorkDetailPopupHandler = () => {
  bodyDOM.removeEventListener("click", bodyHandler);

  popupDOM.classList.add("hidden");
  workDetailPopupDOM.classList.add("hidden");
};

closeWorkDetailPopupDOM.addEventListener("click", closeWorkDetailPopupHandler);
closeItemsPopupDOM.addEventListener("click", closeItemsPopupHandler);
placeDOM.addEventListener("click", placeHandler);
addDOM.addEventListener("click", addHandler);
closeClientsPopupDOM.addEventListener("click", closeClientsPopupHandler);
searchClientFormDOM.addEventListener("submit", searchClientFormHandler);
searchClientsDOM.addEventListener("click", searchClientsHandler);

(async () => {
  const workOrderContainerDOMs = document.querySelectorAll(
    "#workOrderContainer"
  );

  for (const workOrderContainerDOM of workOrderContainerDOMs) {
    workOrderContainerDOM.addEventListener("click", workOrderContainerHandler);

    const id = workOrderContainerDOM.dataset.client_id;

    const response = await FetchAPI.get(`/clients/${id}`);
    if (response) {
      const clientDOM = workOrderContainerDOM.querySelector("#client");
      const data = await response.json();
      const html = `
      <div>
        <span>association: ${data.client.association}</span>
      </div>
      <div>
        <span>name: ${data.client.name}</span>
      </div>
      `;
      clientDOM.insertAdjacentHTML("beforeend", html);
    }
  }
})();

const webSocket = new WebSocket(`ws://${window.location.host}`);
webSocket.onopen = () => {
  console.log("connection success");

  webSocket.onmessage = (event) => {
    console.log(event.data);
  };
};
