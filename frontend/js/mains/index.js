import { DOM, Event, Handler } from "../main";

const videoDOMs = document.querySelectorAll("#main video");
const imageDOMs = document.querySelectorAll("#main img");

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
  imageDOM.addEventListener("click", () => {});
});

class MainDOM extends DOM {
  constructor() {
    // TODO: 입력받은 DOM 하위 DOM을 id로 할당
    // const mainDOM = document.getElementById("main");
    // super(mainDOM);
  }
}
