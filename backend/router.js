import express from "express";
import { rootController } from "./controller";
import { asyncWrapper } from "./middleware";

/**
 * @abstract
 */
class Router {
  constructor(path) {
    this.router = express.Router();
    this.routes = { root: path };
    this.controllers = {};
  }

  init() {
    this.get();
    this.post();
    this.patch();
    this.delete();
    return this;
  }

  /**
   * @abstract
   */
  get() {}

  /**
   * @abstract
   */
  post() {}

  /**
   * @abstract
   */
  patch() {}

  /**
   * @abstract
   */
  delete() {}
}

class RootRouter extends Router {
  constructor(path) {
    super(path);
    this.controllers.getIndex = asyncWrapper(
      rootController.getIndex.bind(rootController)
    );
    this.routes.videos = "/videos";
    this.controllers.getVideo = asyncWrapper(
      rootController.getVideo.bind(rootController)
    );
    this.routes.images = "/images";
    this.controllers.getImage = asyncWrapper(
      rootController.getImage.bind(rootController)
    );
  }

  get() {
    this.router.get(this.routes.root, this.controllers.getIndex);
    this.router.get(this.routes.videos, this.controllers.getVideo);
    this.router.get(this.routes.images, this.controllers.getImage);
  }
}

export const rootRouter = new RootRouter("/").init();
