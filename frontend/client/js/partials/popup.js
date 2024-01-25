const contentDOM = document.getElementById("content");
const popupDOM = document.getElementById("popup");
const createWorkOrderDOM = document.getElementById("createWorkOrder");
const closeDOM = document.getElementById("close");

createWorkOrderDOM.addEventListener("click", () => {
  popupDOM.classList.remove("hidden");
});

closeDOM.addEventListener("click", () => {
  popupDOM.classList.add("hidden");
});
