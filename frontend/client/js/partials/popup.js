const contentDOM = document.getElementById("content");
const popupDOM = document.getElementById("popup");
const createWorkOrderDOM = document.getElementById("createWorkOrder");
const closeDOM = document.getElementById("close");
const cancelDOM = document.getElementById("cancel");

const urgentDOM = document.getElementById("urgent");
const selectedClientDOM = document.getElementById("selectedClient");
const workDetailsDOM = document.getElementById("workDetails");
const commentDOM = document.getElementById("comment");

const clickCreateWorkOrderHandler = () => {
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

createWorkOrderDOM.addEventListener("click", clickCreateWorkOrderHandler);

[closeDOM, cancelDOM].forEach((el) => {
  el.addEventListener("click", clickCreateWorkOrderHandler);
});
