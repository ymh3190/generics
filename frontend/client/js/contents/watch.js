const barsDOM = document.getElementById("bars");
const navDOM = document.getElementById("nav");

navDOM.classList.add("hidden");
barsDOM.addEventListener("click", () => {
  if (navDOM.classList.contains("hidden")) {
    navDOM.classList.remove("hidden");
    return;
  }
  navDOM.classList.add("hidden");
});
