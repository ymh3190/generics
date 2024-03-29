// import FetchAPI from "../fetch-api";
// import * as htmls from "../html";

(() => {
  let workOrderContainerDOMs = document.querySelectorAll("#workOrderContainer");
  if (workOrderContainerDOMs.length) {
    // let workInfoPopupDOM;
    // let popupDOM;
    // let workInfosDOM;

    const allChipDOM = document.getElementById("allChip");
    const resolvingChipDOM = document.getElementById("resolvingChip");
    const completeChipDOM = document.getElementById("completeChip");
    const urgentChipDOM = document.getElementById("urgentChip");
    const dateChipDOM = document.getElementById("dateChip");
    const dateDOM = dateChipDOM.querySelector("#date");
    // const contentDOM = document.getElementById("content");
    // const bodyDOM = document.querySelector("body");

    /* async function workOrderContainerHandler(event) {
      event.stopPropagation();

      if (workInfoPopupDOM.classList.contains("hidden")) {
        bodyDOM.addEventListener("click", bodyHandler);
      }
      popupDOM.classList.remove("hidden");
      workInfoPopupDOM.classList.remove("hidden");

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
        const completeInfoDOM = workInfoPopupDOM.querySelector("#completeInfo");
        completeInfoDOM.textContent = "";
        completeInfoDOM.insertAdjacentHTML("beforeend", html);

        html = `
        <div>
          <span>${workOrder.is_urgent ? "urgent" : ""}</span>
        </div>
        `;
        const urgentInfoDOM = workInfoPopupDOM.querySelector("#urgentInfo");
        urgentInfoDOM.textContent = "";
        urgentInfoDOM.insertAdjacentHTML("beforeend", html);

        html = `
        <div>
          <span>${workOrder.comment}</span>
        </div>
        `;
        const commentInfoDOM = workInfoPopupDOM.querySelector("#commentInfo");
        commentInfoDOM.textContent = "";
        commentInfoDOM.insertAdjacentHTML("beforeend", html);
      }

      const clientId = this.dataset.client_id;
      response = await FetchAPI.get(`/clients/${clientId}`);
      if (response) {
        const data = await response.json();
        const clientDOM = workInfoPopupDOM.querySelector("#client");
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
      if (event.target === workInfoPopupDOM) {
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
      popupDOM.classList.add("hidden");
      workInfoPopupDOM.classList.add("hidden");
    } */

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
    };

    const docsHandler = () => {
      workInfoPopupDOM = document.getElementById("workInfoPopup");
      popupDOM = document.getElementById("popup");
      workInfosDOM = document.getElementById("workInfos");
    };

    document.addEventListener("DOMContentLoaded", docsHandler);
    dateDOM.addEventListener("change", dateHandler);
    urgentChipDOM.addEventListener("click", urgentChipHandler);
    completeChipDOM.addEventListener("click", completeChipHandler);
    resolvingChipDOM.addEventListener("click", resolvingChipHandler);
    allChipDOM.addEventListener("click", allChipHandler);
    return;
  }

  let remnantContainerDOMs = document.querySelectorAll("#remnantContainer");
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
    return;
  }

  let clientContainerDOMs = document.querySelectorAll("#clientContainer");
  if (clientContainerDOMs.length) {
    const associationChipDOM = document.getElementById("associationChip");
    const associationSelectDOM = document.getElementById("associationSelect");
    const nameChipDOM = document.getElementById("nameChip");
    const nameSelectDOM = document.getElementById("nameSelect");

    const associationChipHandler = () => {
      const association = associationSelectDOM.value;
      const clientContainerDOMs = document.querySelectorAll("#clientContainer");
      clientContainerDOMs.forEach((clientContainerDOM) => {
        if (!association) {
          clientContainerDOM.classList.remove("hidden");
          return;
        }

        const associationDOM = clientContainerDOM.querySelector("#association");
        const isMatch = associationDOM.textContent.trim() === association;
        if (!isMatch) {
          clientContainerDOM.classList.add("hidden");
          return;
        }
        clientContainerDOM.classList.remove("hidden");
      });
    };

    const nameChipHandler = () => {
      const name = nameSelectDOM.value;
      const clientContainerDOMs = document.querySelectorAll("#clientContainer");
      clientContainerDOMs.forEach((clientContainerDOM) => {
        if (!name) {
          clientContainerDOM.classList.remove("hidden");
          return;
        }

        const nameDOM = clientContainerDOM.querySelector("#name");
        const isMatch = nameDOM.textContent.trim() === name;
        if (!isMatch) {
          clientContainerDOM.classList.add("hidden");
          return;
        }
        clientContainerDOM.classList.remove("hidden");
      });
    };

    nameChipDOM.addEventListener("change", nameChipHandler);
    associationChipDOM.addEventListener("change", associationChipHandler);
  }
})();
