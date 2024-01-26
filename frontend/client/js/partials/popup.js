const contentDOM = document.getElementById("content");
const popupDOM = document.getElementById("popup");
const createWorkOrderDOM = document.getElementById("createWorkOrder");
const closeDOM = document.getElementById("close");
const cancelDOM = document.getElementById("cancel");

createWorkOrderDOM.addEventListener("click", () => {
  popupDOM.classList.remove("hidden");
});

[closeDOM, cancelDOM].forEach((el) => {
  el.addEventListener("click", () => {
    popupDOM.classList.add("hidden");
  });
});
