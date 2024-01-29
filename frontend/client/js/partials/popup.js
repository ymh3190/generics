const contentDOM = document.getElementById("content");
const popupDOM = document.getElementById("popup");
const closeDOM = document.getElementById("close");
const cancelDOM = document.getElementById("cancel");

const createWorkOrderDOM = document.getElementById("createWorkOrder");
const urgentDOM = document.getElementById("urgent");
const selectedClientDOM = document.getElementById("selectedClient");
const workDetailsDOM = document.getElementById("workDetails");
const commentDOM = document.getElementById("comment");

const createRemnantDOM = document.getElementById("createRemnant");

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
