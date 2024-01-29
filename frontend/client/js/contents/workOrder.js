import FetchAPI from "../fetch-api";

const clientsDOM = document.getElementById("clients");
const searchClientsDOM = document.getElementById("searchClients");
const clientsPopupDOM = document.getElementById("clientsPopup");
const selectedClientDOM = document.getElementById("selectedClient");
const closeClientsPopupDOM = document.getElementById("closeClientsPopup");
const searchClientDOM = document.getElementById("searchClient");
const searchClientFormDOM = document.getElementById("searchClientForm");
const addDOM = document.getElementById("add");
const workDetailsDOM = document.getElementById("workDetails");
const placeDOM = document.getElementById("place");

const itemsDOM = document.getElementById("items");
const itemsPopupDOM = document.getElementById("itemsPopup");
const closeItemsPopupDOM = document.getElementById("closeItemsPopup");
const searchItemFormDOM = document.getElementById("searchItemForm");
const searchItemDOM = document.getElementById("searchItem");

const urgentDOM = document.getElementById("urgent");
const commentDOM = document.getElementById("comment");
const popupDOM = document.getElementById("popup");

const contentDOM = document.getElementById("content");

const itemList = (item) => {
  return `
  <div data-id=${item.id} id='item'>
    <span>${item.name}</span>
  </div>
  `;
};

const clientList = (client) => {
  return `
  <div data-id=${client.id} id='client'>
    <span>${client.association}</span>
    <span>${client.name}</span>
    <span>${client.telephone}</span>
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
    const workDetailDOMs = workDetailsDOM.querySelectorAll("#workDetail");
    for (let i = 0; i < workDetailDOMs.length; i++) {
      if (i === workDetailDOMs.length - 1) {
        const inputDOMs = workDetailDOMs[i].querySelectorAll("input");
        const itemIdDOM = inputDOMs[0];
        itemIdDOM.value = data.item.name;
        itemIdDOM.dataset.id = data.item.id;
      }
    }
    itemsPopupDOM.classList.add("hidden");
  }
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

  const response = await FetchAPI.get("/clients");
  if (response) {
    const data = await response.json();
    let html = "";

    for (const client of data.clients) {
      const isAssociation = regExp.test(client.association);
      if (isAssociation) {
        html += clientList(client);
        continue;
      }

      const isName = regExp.test(client.name);
      if (isName) {
        html += clientList(client);
        continue;
      }

      const isTelephone = regExp.test(client.telephone);
      if (isTelephone) {
        html += clientList(client);
        continue;
      }
    }

    clientsDOM.textContent = "";
    clientsDOM.insertAdjacentHTML("beforeend", html);

    const clientDOMs = clientsDOM.querySelectorAll("#client");
    for (const clientDOM of clientDOMs) {
      clientDOM.addEventListener("click", clickClientHandler);
    }
  }
};

const closeClientsPopupHandler = () => {
  clientsPopupDOM.classList.add("hidden");
};

const addHandler = async () => {
  itemsPopupDOM.classList.remove("hidden");

  const workDetailDOMs = workDetailsDOM.querySelectorAll("#workDetail");
  for (let i = 0; i < workDetailDOMs.length; i++) {
    if (i === workDetailDOMs.length - 1) {
      const inputDOMs = workDetailDOMs[i].querySelectorAll("input");
      const itemIdDOM = inputDOMs[0];
      if (!itemIdDOM.value) {
        alert("Item not found");
        return;
      }
    }
  }

  const html = `
  <div class='work-detail' id='workDetail'>
    <div>
      <input type='text' name='itemId'>
    </div>
    <div>
      <input type='text' name='depth'>
    </div>
    <div>
      <input type='text' name='width'>
    </div>
    <div>
      <input type='text' name='length'>
    </div>
    <div>
      <input type='text' name='quantity'>
    </div>
    <div>
      <input type='text' name='remnant'>
    </div>
    <div>
      <button id='delete'>delete</button>
    </div>
  </div>
  `;

  workDetailsDOM.insertAdjacentHTML("beforeend", html);
  const newWorkDetailDOMs = workDetailsDOM.querySelectorAll("#workDetail");
  for (let i = 0; i < newWorkDetailDOMs.length; i++) {
    if (i === newWorkDetailDOMs.length - 1) {
      const deleteDOM = newWorkDetailDOMs[i].querySelector("#delete");
      deleteDOM.addEventListener("click", () => {
        newWorkDetailDOMs[i].remove();
      });
    }
  }

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

  const workDetailDOMs = workDetailsDOM.querySelectorAll("#workDetail");
  for (const workDetailDOM of workDetailDOMs) {
    const inputDOMs = workDetailDOM.querySelectorAll("input");
    const item_id = inputDOMs[0].dataset.id;
    const depth = inputDOMs[1].value;
    const width = inputDOMs[2].value;
    const length = inputDOMs[3].value;
    const quantity = inputDOMs[4].value;
    const remnant = inputDOMs[5].value;

    if (!item_id || !depth || !width || !length || !quantity) {
      alert("Provide all values");
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

const searchItemFormHandler = async (event) => {
  event.preventDefault();

  const searchItem = searchItemDOM.value;
  const regExp = new RegExp(searchItem, "i");

  const response = await FetchAPI.get("/items");
  if (response) {
    const data = await response.json();
    let html = "";

    for (const item of data.items) {
      const isName = regExp.test(item.name);
      if (isName) {
        html += itemList(item);
        continue;
      }
    }

    itemsDOM.textContent = "";
    itemsDOM.insertAdjacentHTML("beforeend", html);

    const itemDOMs = itemsDOM.querySelectorAll("#item");
    for (const itemDOM of itemDOMs) {
      itemDOM.addEventListener("click", clickItemHandler);
    }
  }
};

searchItemFormDOM.addEventListener("submit", searchItemFormHandler);
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
    const id = workOrderContainerDOM.dataset.client_id;

    const response = await FetchAPI.get(`/clients/${id}`);
    if (response) {
      const clientDOM = workOrderContainerDOM.querySelector("#client");
      const data = await response.json();
      const html = `
      <div>
        <span>${data.client.association}</span>
      </div>
      <div>
        <span>${data.client.name}</span>
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
