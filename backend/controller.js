import { readdirSync } from "fs";

const files = readdirSync("static").map((result) => `/static/${result}`);
const videos = files.filter((file) => file.endsWith("mov"));
const images = files.filter((file) => file.endsWith("png"));

/**
 * @abstract
 */
class RenderController {
  constructor() {
    this.pages = {};
    this.options = {};
  }
}

class RootController extends RenderController {
  constructor() {
    super();
    this.pages.index = "contents/index";
    this.options.index = { pageTitle: "Index", files };
    this.pages.video = "contents/video";
    this.options.video = { pageTitle: "Video", videos };
    this.pages.image = "contents/image";
    this.options.image = { pageTitle: "Image", images };
  }

  getIndex(req, res) {
    res.status(200).render(this.pages.index, this.options.index);
  }

  getVideo(req, res) {
    res.status(200).render(this.pages.video, this.options.video);
  }

  getImage(req, res) {
    res.status(200).render(this.pages.image, this.options.image);
  }
}

class ApiController {
  constructor() {}
}

export const rootController = new RootController();
