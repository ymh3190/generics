import express from "express";
import {
  monitorController,
  authController,
  imageController,
  videoController,
  workOrderController,
} from "./controller";
import middleware from "./middleware";

class Router {
  constructor() {
    this.router = express.Router();
  }
}

class WorkOrderRouter extends Router {
  constructor() {
    super();

    this.router
      .route("/")
      .get(middleware.authenticateUser, workOrderController.getWorkOrders)
      .post(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        workOrderController.createWorkOrder
      );

    this.router
      .route("/:id(\\d|\\w{32})")
      .get(middleware.authenticateUser, workOrderController.getWorkOrder)
      .patch(middleware.authenticateUser, workOrderController.updateWorkOrder)
      .delete(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        workOrderController.deleteWorkOrder
      );
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
const { router: workOrderRouter } = new WorkOrderRouter();
export { authRouter, monitorRouter, imageRouter, videoRouter, workOrderRouter };
