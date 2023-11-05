const barsDOM = document.getElementById("bars");
const navDOM = document.getElementById("nav");
const anchorDOMs = navDOM.querySelectorAll("a");

barsDOM.addEventListener("click", () => {
  for (const anchorDOM of anchorDOMs) {
    if (anchorDOM.classList.contains("column")) {
      anchorDOM.classList.remove("column");
      anchorDOM.classList.add("flex");
      const iconDOM = anchorDOM.querySelector("i");
      iconDOM.classList.remove("margin-bottom");
      iconDOM.classList.add("margin-right");
    } else if (anchorDOM.classList.contains("flex")) {
      anchorDOM.classList.remove("flex");
      anchorDOM.classList.add("column");
      const iconDOM = anchorDOM.querySelector("i");
      iconDOM.classList.remove("margin-right");
      iconDOM.classList.add("margin-bottom");
    }
  }
});
