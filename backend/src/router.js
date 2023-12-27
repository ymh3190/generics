import express from "express";
import {
  monitorController,
  authController,
  imageController,
  videoController,
} from "./controller";
import middleware from "./middleware";

class Router {
  constructor() {
    this.router = express.Router();
  }
}

class ImageRouter extends Router {
  constructor() {
    super();

    this.routes = {
      root: "/api/v1/images",
      index: "/",
      image: "/:id(\\d|\\w{32})",
    };

    this.controllers = {
      createImage: imageController.createImage,
      getImages: imageController.getImages,
      getImage: middleware.asyncWrapper(imageController.getImage),
    };

    this.router
      .route(this.routes.index)
      .get(this.controllers.getImages)
      .post(this.controllers.createImage);

    this.router.route(this.routes.image).get(this.controllers.getImage);
  }
}

class VideoRouter extends Router {
  constructor() {
    super();

    this.routes = {
      root: "/api/v1/videos",
      index: "/",
      video: "/:id(\\d|\\w{32})",
    };

    this.controllers = {
      createVideo: videoController.createVideo,
      getVideos: videoController.getVideos,
      getVideo: middleware.asyncWrapper(videoController.getVideo),
    };

    this.router
      .route(this.routes.index)
      .get(this.controllers.getVideos)
      .post(this.controllers.createVideo);

    this.router.route(this.routes.video).get(this.controllers.getVideo);
  }
}

class AuthRouter extends Router {
  constructor() {
    super();

    this.routes = {
      root: "/api/v1/auth",
      signup: "/signup",
      signin: "/signin",
      signout: "/signout",
    };

    this.controllers = {
      signout: authController.signout,
      signin: middleware.asyncWrapper(authController.signin),
      signup: middleware.asyncWrapper(authController.signup),
    };

    this.#post();
    this.#delete();
  }

  #post() {
    this.router.post(this.routes.signup, this.controllers.signup);
    this.router.post(this.routes.signin, this.controllers.signin);
  }

  #delete() {
    this.router.delete(
      this.routes.signout,
      middleware.authenticateUser,
      this.controllers.signout
    );
  }
}

class MonitorRouter extends Router {
  constructor() {
    super();

    this.routes = {
      root: "/api/monitor",
      memory: "/memory",
    };

    this.controllers = {
      memory: monitorController.memory,
    };

    this.#get();
  }

  #get() {
    this.router.get(this.routes.memory, this.controllers.memory);
  }
}

const authRouter = new AuthRouter();
const monitorRouter = new MonitorRouter();
const imageRouter = new ImageRouter();
const videoRouter = new VideoRouter();
export { authRouter, monitorRouter, imageRouter, videoRouter };
