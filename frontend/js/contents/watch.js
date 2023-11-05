const barsDOM = document.getElementById("bars");
const navDOM = document.getElementById("nav");

navDOM.classList.add("hide");
barsDOM.addEventListener("click", () => {
  if (navDOM.classList.contains("hide")) {
    navDOM.classList.remove("hide");
  } else {
    navDOM.classList.add("hide");
  }
});
