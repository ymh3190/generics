const barsDOM = document.getElementById("bars");

if (barsDOM) {
  const navDOM = document.getElementById("nav");
  const anchorDOMs = navDOM.querySelectorAll("a");
  const contentDOM = document.getElementById("content");
  const statusDOM = document.getElementById("status");
  const entryDOM = document.getElementById("entry");

  const barsHandler = () => {
    for (const anchorDOM of anchorDOMs) {
      if (anchorDOM.classList.contains("column")) {
        anchorDOM.classList.remove("column");
        anchorDOM.classList.add("flex");
        const iconDOM = anchorDOM.querySelector("i");
        iconDOM.classList.remove("margin-bottom");
        iconDOM.classList.add("margin-right");
        contentDOM.classList.remove("padding-left");
        continue;
      }
      anchorDOM.classList.remove("flex");
      anchorDOM.classList.add("column");
      const iconDOM = anchorDOM.querySelector("i");
      iconDOM.classList.remove("margin-right");
      iconDOM.classList.add("margin-bottom");
      contentDOM.classList.add("padding-left");
    }

    if (!statusDOM) {
      return;
    }

    if (statusDOM.classList.contains("position-left")) {
      statusDOM.classList.remove("position-left");
      entryDOM.classList.remove("position-left");
      navDOM.classList.remove("column-nav-width");
      return;
    }

    statusDOM.classList.add("position-left");
    entryDOM.classList.add("position-left");
    navDOM.classList.add("column-nav-width");
  };

  barsDOM.addEventListener("click", barsHandler);

  const isMobile = window.innerWidth <= 400;
  const isTablet = window.innerWidth <= 850;
  const isMobileOrTable = isMobile || isTablet;
  if (isMobileOrTable) {
    statusDOM.classList.add("position-left");

    for (const anchorDOM of anchorDOMs) {
      anchorDOM.classList.remove("flex");
      anchorDOM.classList.add("column");
      const iconDOM = anchorDOM.querySelector("i");
      iconDOM.classList.remove("margin-right");
      iconDOM.classList.add("margin-bottom");
      contentDOM.classList.add("padding-left");
    }
  }
}
