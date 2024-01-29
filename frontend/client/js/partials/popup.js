import FetchAPI from "../fetch-api";

const contentDOM = document.getElementById("content");
const popupDOM = document.getElementById("popup");
const closeDOM = document.getElementById("close");
const cancelDOM = document.getElementById("cancel");

const createWorkOrderDOM = document.getElementById("createWorkOrder");
const urgentDOM = document.getElementById("urgent");
const selectedClientDOM = document.getElementById("selectedClient");
const workDetailsDOM = document.getElementById("workDetails");
// const commentDOM = document.getElementById("comment");
const commentDOM = document.querySelector(".work-order-popup #comment");

const createRemnantDOM = document.getElementById("createRemnant");
const newZoneDOM = document.getElementById("newZone");
const createZoneFormDOM = document.getElementById("createZoneForm");
const nameDOM = document.getElementById("name");
const zoneCommentDOM = document.querySelector("#zonesPopup #comment");
const zonesDOM = document.getElementById("zones");

const zoneList = (zone) => {
  return `
  <div data-id=${zone.id} id='zone' style="display: grid; grid-template-columns: repeat(2, 1fr);">
    <div>
      <span>${zone.name}</span>
    </div>
    <div>
      <span>${zone.comment}</span>
    </div>
  </div>
  `;
};

const createWorkOrderHandler = () => {
  const icon = createWorkOrderDOM.querySelector("i");
  if (popupDOM.classList.contains("hidden")) {
    popupDOM.classList.remove("hidden");
    icon.className = icon.className.replace("regular", "solid");
    urgentDOM.checked = false;
    selectedClientDOM.value = "";
    commentDOM.value = "";
    const workDetailsDOMs = workDetailsDOM.querySelectorAll("#workDetail");
    for (const workDetailsDOM of workDetailsDOMs) {
      workDetailsDOM.remove();
    }
    return;
  }

  popupDOM.classList.add("hidden");
  icon.className = icon.className.replace("solid", "regular");
};

const createRemnantHandler = () => {
  const icon = createRemnantDOM.querySelector("i");
  if (popupDOM.classList.contains("hidden")) {
    popupDOM.classList.remove("hidden");
    icon.className = icon.className.replace("regular", "solid");
    return;
  }

  popupDOM.classList.add("hidden");
  icon.className = icon.className.replace("solid", "regular");
};

const newZoneHandler = () => {};

const createZoneFormHandler = async (event) => {
  event.preventDefault();

  const name = nameDOM.value;
  const comment = zoneCommentDOM.value;

  const response = await FetchAPI.post("/remnant-zones", { name, comment });
  if (response) {
    const data = await response.json();
    const html = zoneList(data.remnantZone);
    zonesDOM.insertAdjacentHTML("beforeend", html);
  }
};

createZoneFormDOM.addEventListener("submit", createZoneFormHandler);
newZoneDOM.addEventListener("click", newZoneHandler);
createRemnantDOM?.addEventListener("click", createRemnantHandler);
createWorkOrderDOM?.addEventListener("click", createWorkOrderHandler);

for (const dom of [closeDOM, cancelDOM]) {
  if (createWorkOrderDOM) {
    dom.addEventListener("click", createWorkOrderHandler);
    continue;
  }

  if (createRemnantDOM) {
    dom.addEventListener("click", createRemnantHandler);
  }
}
