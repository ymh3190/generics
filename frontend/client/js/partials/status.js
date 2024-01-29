const allChipDOM = document.getElementById("allChip");
const resolvingChipDOM = document.getElementById("resolvingChip");
const completeChipDOM = document.getElementById("completeChip");
const urgentChipDOM = document.getElementById("urgentChip");

const remnantContainerDOMs = document.querySelectorAll("#remnantContainer");
const itemChipDOM = document.getElementById("itemChip");
const itemSelectDOM = document.getElementById("itemSelect");
const zoneChipDOM = document.getElementById("zoneChip");
const zoneSelectDOM = document.getElementById("zoneSelect");

let workOrderContainerDOMs;

const allChipHandler = () => {
  workOrderContainerDOMs = document.querySelectorAll("#workOrderContainer");

  for (const workOrderContainerDOM of workOrderContainerDOMs) {
    workOrderContainerDOM.classList.remove("hidden");
  }
};

const resolvingChipHandler = () => {
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

const itemChipHandler = () => {
  const id = itemSelectDOM.value;

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

zoneChipDOM?.addEventListener("change", zoneChipHandler);
itemChipDOM?.addEventListener("change", itemChipHandler);
urgentChipDOM?.addEventListener("click", urgentChipHandler);
completeChipDOM?.addEventListener("click", completeChipHandler);
resolvingChipDOM?.addEventListener("click", resolvingChipHandler);
allChipDOM?.addEventListener("click", allChipHandler);
