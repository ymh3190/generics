import { DOM, Event, Handler } from "../main";

const videoDOMs = document.querySelectorAll("#main video");
const imageDOMs = document.querySelectorAll("#main img");
const contentDOM = document.getElementById("content");

videoDOMs.forEach((videoDOM) => {
  videoDOM.addEventListener("click", () => {
    if (videoDOM.paused) {
      videoDOM.play();
    } else {
      videoDOM.pause();
    }
  });
});

imageDOMs.forEach((imageDOM) => {
  imageDOM.addEventListener("click", () => {
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.left = 0;
    div.style.top = 0;
    const img = document.createElement("img");
    img.src = imageDOM.src;
    img.style.height = "760px";
    div.appendChild(img);
    contentDOM.style.position = "relative";
    div.addEventListener("click", () => {
      div.remove();
    });
    contentDOM.appendChild(div);
  });
});

class MainDOM extends DOM {
  constructor() {
    // TODO: 입력받은 DOM 하위 DOM을 id로 할당
    // const mainDOM = document.getElementById("main");
    // super(mainDOM);
  }
}
