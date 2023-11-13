import express from "express";
import { rootController } from "./controller";
import { asyncWrapper } from "./middleware";

/** @interface */
class Router {
  constructor(path) {
    this.router = express.Router();
    this.routes = { root: path };
    this.controllers = {};
  }

  /** @interface */
  #route() {}

  /** @interface */
  #get() {}

  /** @interface */
  #post() {}

  /** @interface */
  #patch() {}

  /** @interface */
  #delete() {}
}

class RootRouter extends Router {
  constructor(path) {
    super(path);
    this.controllers.getIndex = asyncWrapper(
      rootController.getIndex.bind(rootController)
    );

    this.routes.video = "/video";
    this.controllers.getVideo = asyncWrapper(
      rootController.getVideo.bind(rootController)
    );

    this.routes.watch = "/watch/:id(\\d|\\w{32})";
    this.controllers.getWatch = asyncWrapper(
      rootController.getWatch.bind(rootController)
    );

    this.#get();
  }

  /** @implements */
  #get() {
    this.router.get(this.routes.root, this.controllers.getIndex);
    this.router.get(this.routes.video, this.controllers.getVideo);
    this.router.get(this.routes.watch, this.controllers.getWatch);
  }
}

export const rootRouter = new RootRouter("/");
