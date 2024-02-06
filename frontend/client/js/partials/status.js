import FetchAPI from "../fetch-api";
import * as htmls from "../htmls";

let workOrderContainerDOMs = document.querySelectorAll("#workOrderContainer");
let remnantContainerDOMs = document.querySelectorAll("#remnantContainer");

if (workOrderContainerDOMs.length) {
  let workDetailPopupDOM;
  let popupDOM;
  let workInfosDOM;

  const allChipDOM = document.getElementById("allChip");
  const resolvingChipDOM = document.getElementById("resolvingChip");
  const completeChipDOM = document.getElementById("completeChip");
  const urgentChipDOM = document.getElementById("urgentChip");
  const dateChipDOM = document.getElementById("dateChip");
  const dateDOM = dateChipDOM.querySelector("#date");
  const contentDOM = document.getElementById("content");
  const bodyDOM = document.querySelector("body");

  async function workOrderContainerHandler(event) {
    event.stopPropagation();

    if (workDetailPopupDOM.classList.contains("hidden")) {
      bodyDOM.addEventListener("click", bodyHandler);
    }
    popupDOM.classList.remove("hidden");
    workDetailPopupDOM.classList.remove("hidden");

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

  function spotlightChip(dom) {
    const chips = [
      allChipDOM,
      resolvingChipDOM,
      completeChipDOM,
      urgentChipDOM,
      dateChipDOM,
    ];
    for (const chip of chips) {
      if (dom !== chip) {
        chip.classList.add("release");
        chip.classList.remove("click");
        continue;
      }
      dom.classList.add("click");
      dom.classList.remove("release");
    }
  }

  const allChipHandler = () => {
    spotlightChip(allChipDOM);
    workOrderContainerDOMs = document.querySelectorAll("#workOrderContainer");

    for (const workOrderContainerDOM of workOrderContainerDOMs) {
      workOrderContainerDOM.classList.remove("hidden");
    }
  };

  const resolvingChipHandler = () => {
    spotlightChip(resolvingChipDOM);
    workOrderContainerDOMs = document.querySelectorAll("#workOrderContainer");

    for (const workOrderContainerDOM of workOrderContainerDOMs) {
      const is_complete = workOrderContainerDOM.dataset.is_complete;
      if (is_complete !== "0") {
        workOrderContainerDOM.classList.add("hidden");
        continue;
      }
      workOrderContainerDOM.classList.remove("hidden");
    }
  };

  const completeChipHandler = () => {
    spotlightChip(completeChipDOM);
    workOrderContainerDOMs = document.querySelectorAll("#workOrderContainer");

    for (const workOrderContainerDOM of workOrderContainerDOMs) {
      const is_complete = workOrderContainerDOM.dataset.is_complete;
      if (is_complete !== "1") {
        workOrderContainerDOM.classList.add("hidden");
        continue;
      }
      workOrderContainerDOM.classList.remove("hidden");
    }
  };

  const urgentChipHandler = () => {
    spotlightChip(urgentChipDOM);
    workOrderContainerDOMs = document.querySelectorAll("#workOrderContainer");

    for (const workOrderContainerDOM of workOrderContainerDOMs) {
      const is_urgent = workOrderContainerDOM.dataset.is_urgent;
      if (is_urgent !== "1") {
        workOrderContainerDOM.classList.add("hidden");
        continue;
      }
      workOrderContainerDOM.classList.remove("hidden");
    }
  };

  const dateHandler = async () => {
    spotlightChip(dateChipDOM);
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
          });
        }
      });
    }
  };

  dateDOM.addEventListener("change", dateHandler);
  urgentChipDOM.addEventListener("click", urgentChipHandler);
  completeChipDOM.addEventListener("click", completeChipHandler);
  resolvingChipDOM.addEventListener("click", resolvingChipHandler);
  allChipDOM.addEventListener("click", allChipHandler);
  document.addEventListener("DOMContentLoaded", () => {
    workDetailPopupDOM = document.getElementById("workDetailPopup");
    popupDOM = document.getElementById("popup");
    workInfosDOM = document.getElementById("workInfos");
  });
}

if (remnantContainerDOMs.length) {
  const itemChipDOM = document.getElementById("itemChip");
  const itemSelectDOM = document.getElementById("itemSelect");
  const zoneChipDOM = document.getElementById("zoneChip");
  const zoneSelectDOM = document.getElementById("zoneSelect");

  const itemChipHandler = () => {
    const id = itemSelectDOM.value;
    remnantContainerDOMs = document.querySelectorAll("#remnantContainer");

    if (!id) {
      for (const remnantContainerDOM of remnantContainerDOMs) {
        remnantContainerDOM.classList.remove("item-hidden");
      }
      return;
    }

    for (const remnantContainerDOM of remnantContainerDOMs) {
      const itemId = remnantContainerDOM.dataset.item_id;
      if (id === itemId) {
        remnantContainerDOM.classList.remove("item-hidden");
        continue;
      }
      remnantContainerDOM.classList.add("item-hidden");
    }
  };

  const zoneChipHandler = () => {
    const id = zoneSelectDOM.value;
    remnantContainerDOMs = document.querySelectorAll("#remnantContainer");

    if (!id) {
      for (const remnantContainerDOM of remnantContainerDOMs) {
        remnantContainerDOM.classList.remove("zone-hidden");
      }
      return;
    }

    for (const remnantContainerDOM of remnantContainerDOMs) {
      const zoneId = remnantContainerDOM.dataset.zone_id;
      if (id === zoneId) {
        remnantContainerDOM.classList.remove("zone-hidden");
        continue;
      }
      remnantContainerDOM.classList.add("zone-hidden");
    }
  };

  zoneChipDOM.addEventListener("change", zoneChipHandler);
  itemChipDOM.addEventListener("change", itemChipHandler);
}
