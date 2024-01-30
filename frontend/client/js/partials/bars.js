const barsDOM = document.getElementById("bars");
const navDOM = document.getElementById("nav");
const anchorDOMs = navDOM?.querySelectorAll("a");
const contentDOM = document.getElementById("content");
const statusDOM = document.getElementById("status");

const isMobile = window.innerWidth <= 400;
const isTablet = window.innerWidth <= 850;

const barsHandler = () => {
  if (!isMobile) {
    contentDOM?.classList.add("padding-left");
  }

  for (const anchorDOM of anchorDOMs) {
    if (anchorDOM.classList.contains("column")) {
      anchorDOM.classList.remove("column");
      anchorDOM.classList.add("flex");
      const iconDOM = anchorDOM.querySelector("i");
      iconDOM.classList.remove("margin-bottom");
      iconDOM.classList.add("margin-right");
      continue;
    }
    anchorDOM.classList.remove("flex");
    anchorDOM.classList.add("column");
    const iconDOM = anchorDOM.querySelector("i");
    iconDOM.classList.remove("margin-right");
    iconDOM.classList.add("margin-bottom");
  }

  if (statusDOM?.classList.contains("position-left")) {
    statusDOM?.classList.remove("position-left");
    return;
  }

  statusDOM?.classList.add("position-left");
};

barsDOM?.addEventListener("click", barsHandler);

if ((isMobile || isTablet) && anchorDOMs) {
  for (const anchorDOM of anchorDOMs) {
    anchorDOM.classList.remove("flex");
    anchorDOM.classList.add("column");
    const iconDOM = anchorDOM.querySelector("i");
    iconDOM.classList.remove("margin-right");
    iconDOM.classList.add("margin-bottom");
    contentDOM?.classList.add("padding-left");
  }

  statusDOM?.classList.add("position-left");
}
