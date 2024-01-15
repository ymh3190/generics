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

    this.router
      .route("/")
      .get(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        imageController.getImages
      )
      .post(imageController.createImage);

    this.router.route("/:id(\\d|\\w{32})").get(imageController.getImage);
  }
}

class VideoRouter extends Router {
  constructor() {
    super();

    this.router
      .route("/")
      .get(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        videoController.getVideos
      )
      .post(videoController.createVideo);

    this.router
      .route("/:id(\\d|\\w{32})")
      .get(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        videoController.getVideo
      );
  }
}

class AuthRouter extends Router {
  constructor() {
    super();

    this.router.post("/signup", authController.signup);

    this.router.post("/signin", authController.signin);

    this.router.delete(
      "/signout",
      middleware.authenticateUser,
      authController.signout
    );
  }
}

class MonitorRouter extends Router {
  constructor() {
    super();

    this.router.get("/memory", monitorController.memory);
  }
}

const { router: authRouter } = new AuthRouter();
const { router: monitorRouter } = new MonitorRouter();
const { router: imageRouter } = new ImageRouter();
const { router: videoRouter } = new VideoRouter();
export { authRouter, monitorRouter, imageRouter, videoRouter };
