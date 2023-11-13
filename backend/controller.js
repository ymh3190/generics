import Video from "../test/video";
import Image from "../test/image";

/** @interface */
class RenderController {
  constructor() {
    this.views = {};
    this.options = {};
  }
}

class RootController extends RenderController {
  constructor() {
    super();
    this.views.index = "index";
    this.options.index = { pageTitle: "Generics", images: null };

    this.views.watch = "watch";
    this.options.watch = { pageTitle: null, video: null };

    this.views.video = "video";
    this.options.video = { pageTitle: "Videos", videos: null };
  }

  async getIndex(req, res) {
    const images = await Image.select({});
    this.options.index.images = images;
    res.status(200).render(this.views.index, this.options.index);
  }

  async getWatch(req, res) {
    const { id } = req.params;
    if (!id) throw new Error("Bad request");
    const video = await Video.selectById(id);
    if (!video) throw new Error("Video not found");
    this.options.watch.pageTitle = video.id;
    this.options.watch.video = video;
    res.status(200).render(this.views.watch, this.options.watch);
  }

  async getVideo(req, res) {
    const videos = await Video.select({});
    this.options.video.pageTitle = "Videos";
    this.options.video.videos = videos;
    res.status(200).render(this.views.video, this.options.video);
  }
}

class ApiController {}

export const rootController = new RootController();
