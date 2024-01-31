import FetchAPI from "../fetch-api";

let workOrderContainerDOMs = document.querySelectorAll("#workOrderContainer");
let remnantContainerDOMs = document.querySelectorAll("#remnantContainer");

if (workOrderContainerDOMs.length) {
  const allChipDOM = document.getElementById("allChip");
  const resolvingChipDOM = document.getElementById("resolvingChip");
  const completeChipDOM = document.getElementById("completeChip");
  const urgentChipDOM = document.getElementById("urgentChip");
  const dateChipDOM = document.getElementById("dateChip");
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

  const dateChipHandler = async () => {
    spotlightChip(dateChipDOM);
    workOrderContainerDOMs = document.querySelectorAll("#workOrderContainer");
    for (const workOrderContainerDOM of workOrderContainerDOMs) {
      workOrderContainerDOM.remove();
    }

    const date = dateChipDOM.value;
    const response = await FetchAPI.post("/work-orders/date", {
      created_at: date,
    });
    if (response) {
      const data = await response.json();

      for (const workOrder of data.workOrders) {
        let clientHtml;

        const response = await FetchAPI.get(`/clients/${workOrder.client_id}`);
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
        contentDOM.insertAdjacentHTML("beforeend", html);
      }
    }
  };

  dateChipDOM.addEventListener("change", dateChipHandler);
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
