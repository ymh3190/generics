const barsDOM = document.getElementById("bars");
const navDOM = document.getElementById("nav");
const anchorDOMs = navDOM.querySelectorAll("a");
const contentDOM = document.getElementById("content");

const isMobile = window.innerWidth <= 400;
const isTablet = window.innerWidth <= 850;
const isMobileOrTable = isMobile || isTablet;
if (isMobileOrTable) {
  for (const anchorDOM of anchorDOMs) {
    anchorDOM.classList.remove("flex");
    anchorDOM.classList.add("column");
    const iconDOM = anchorDOM.querySelector("i");
    iconDOM.classList.remove("margin-right");
    iconDOM.classList.add("margin-bottom");
    contentDOM?.classList.add("padding-left");
  }
}

barsDOM.addEventListener("click", () => {
  for (const anchorDOM of anchorDOMs) {
    if (anchorDOM.classList.contains("column")) {
      anchorDOM.classList.remove("column");
      anchorDOM.classList.add("flex");
      const iconDOM = anchorDOM.querySelector("i");
      iconDOM.classList.remove("margin-bottom");
      iconDOM.classList.add("margin-right");
      contentDOM?.classList.remove("padding-left");
      continue;
    }
    anchorDOM.classList.remove("flex");
    anchorDOM.classList.add("column");
    const iconDOM = anchorDOM.querySelector("i");
    iconDOM.classList.remove("margin-right");
    iconDOM.classList.add("margin-bottom");
    contentDOM?.classList.add("padding-left");
  }
});
