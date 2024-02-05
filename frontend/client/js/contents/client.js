import FetchAPI from "../fetch-api";
import * as htmls from "../htmls";

// const bodyDOM = document.getElementById("body");
const popupDOM = document.getElementById("popup");
const clientPopupDOM = document.getElementById("clientPopup");
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

async function clientContainerHandler(event) {
  event.stopPropagation();

  // if (workInfoPopupDOM.classList.contains("hidden")) {
  //   bodyDOM.addEventListener("click", bodyHandler);
  // }
  popupDOM.classList.remove("hidden");
  workInfoPopupDOM.classList.remove("hidden");

  const client_id = this.dataset.id;

  let workOrders;
  let response = await FetchAPI.post("/work-orders/client", { client_id });
  if (response) {
    const data = await response.json();
    workOrders = data.workOrders;
    let html = "";
    for (const workOrder of data.workOrders) {
      console.log(workOrder);
      html += `
      <div class="info-container">
          <div class="top">
              <div>
                  <div id="completeInfo" class="complete-info">
                    <span>${workOrder.is_complete ? "complete" : ""}</span>
                  </div>
                  <div id="endDate" class="end-date">
                    <span>${workOrder.end_date ? workOrder.end_date : ""}</span>
                  </div>
              </div>
              <div id="urgentInfo" class="urgent-info">
                <span>${workOrder.is_urgent ? "urgent" : ""}</span>
              </div>
          </div>
          <div id="worker" class="worker-info">
            <span>${workOrder.worker_id ? workOrder.worker_id : ""}</span>
          </div>
          <div class="datetime">
            <span>${workOrder.created_at}</span>
          </div>
      </div>
      `;
    }
    infoContainersDOM.insertAdjacentHTML("beforeend", html);
  }
  if (!workOrders) {
    return;
  }

  // let workOrder;
  // let response = await FetchAPI.get(`/work-orders/${workOrderId}`);
  // if (response) {
  //   const data = await response.json();
  //   workOrder = data.workOrder;
  //   let html = `
  //   <div>
  //     <div class='top'>
  //       <span>${workOrder.is_complete ? "complete" : "resolving"}</span>
  //     </div>
  //     ${
  //       workOrder.is_complete
  //         ? `<div><span>${workOrder.end_date}</span></div>`
  //         : ""
  //     }
  //   </div>
  //   `;
  //   const completeInfoDOM = workDetailPopupDOM.querySelector("#completeInfo");
  //   completeInfoDOM.textContent = "";
  //   completeInfoDOM.insertAdjacentHTML("beforeend", html);

  //   html = `
  //   <div>
  //     <span>${workOrder.is_urgent ? "urgent" : ""}</span>
  //   </div>
  //   `;
  //   const urgentInfoDOM = workDetailPopupDOM.querySelector("#urgentInfo");
  //   urgentInfoDOM.textContent = "";
  //   urgentInfoDOM.insertAdjacentHTML("beforeend", html);

  //   html = `
  //   <div>
  //     <span>${workOrder.comment}</span>
  //   </div>
  //   `;
  //   const commentInfoDOM = workDetailPopupDOM.querySelector("#commentInfo");
  //   commentInfoDOM.textContent = "";
  //   commentInfoDOM.insertAdjacentHTML("beforeend", html);
  // }

  // const clientId = this.dataset.client_id;
  // response = await FetchAPI.get(`/clients/${clientId}`);
  // if (response) {
  //   const data = await response.json();
  //   const clientDOM = workDetailPopupDOM.querySelector("#client");
  //   const html = htmls.clientList(data.client);
  //   clientDOM.textContent = "";
  //   clientDOM.insertAdjacentHTML("beforeend", html);
  // }

  // response = await FetchAPI.get(`/work-orders/${workOrderId}/details`);
  // if (response) {
  //   const data = await response.json();
  //   const workDetails = data.workDetails;
  //   let html = "";

  //   for (const workDetail of workDetails) {
  //     const itemId = workDetail.item_id;
  //     const response = await FetchAPI.get(`/items/${itemId}`);
  //     if (response) {
  //       const data = await response.json();
  //       const item = data.item;
  //       const workInfo = { workDetail, item };
  //       html += htmls.workInfoList(workInfo);
  //     }
  //   }
  //   workInfosDOM.textContent = "";
  //   workInfosDOM.insertAdjacentHTML("beforeend", html);
  // }
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
    popupDOM.classList.add("hidden");
    clientPopupDOM.classList.add("hidden");
    const icon = createClientDOM.querySelector("i");
    icon.className = icon.className.replace("solid", "regular");
  }

  associationDOM.value = "";
  nameDOM.value = "";
  telephoneDOM.value = "";
};

const closeWorkInfoPopupHandler = () => {
  workInfoPopupDOM.classList.add("hidden");
};

closeWorkInfoPopupDOM.addEventListener("click", closeWorkInfoPopupHandler);
createClientFormDOM.addEventListener("submit", createClientFormHandler);

const clientContainerDOMs = document.querySelectorAll("#clientContainer");
clientContainerDOMs.forEach((clientContainerDOM) => {
  clientContainerDOM.addEventListener("click", clientContainerHandler);
});
