import FetchAPI from "../fetch-api";
import * as htmls from "../htmls";

let workOrderContainerDOMs = document.querySelectorAll("#workOrderContainer");
let remnantContainerDOMs = document.querySelectorAll("#remnantContainer");

if (workOrderContainerDOMs.length) {
  const allChipDOM = document.getElementById("allChip");
  const resolvingChipDOM = document.getElementById("resolvingChip");
  const completeChipDOM = document.getElementById("completeChip");
  const urgentChipDOM = document.getElementById("urgentChip");
  const dateChipDOM = document.getElementById("dateChip");
  const dateDOM = dateChipDOM.querySelector("#date");
  const contentDOM = document.getElementById("content");

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
    for (const workOrderContainerDOM of workOrderContainerDOMs) {
      workOrderContainerDOM.remove();
    }

    const date = dateDOM.value;
    const response = await FetchAPI.post("/work-orders/date", {
      created_at: date,
    });
    if (response) {
      const data = await response.json();

      for (const workOrder of data.workOrders) {
        const response = await FetchAPI.get(`/clients/${workOrder.client_id}`);
        if (response) {
          const data = await response.json();
          const html = htmls.workOrderList(workOrder, data.client);
          contentDOM.insertAdjacentHTML("beforeend", html);
        }
      }
    }
  };

  dateDOM.addEventListener("change", dateHandler);
  urgentChipDOM.addEventListener("click", urgentChipHandler);
  completeChipDOM.addEventListener("click", completeChipHandler);
  resolvingChipDOM.addEventListener("click", resolvingChipHandler);
  allChipDOM.addEventListener("click", allChipHandler);
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
