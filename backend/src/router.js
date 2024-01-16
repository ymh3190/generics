import express from "express";
import {
  monitorController,
  authController,
  imageController,
  videoController,
  workOrderController,
  workDetailController,
  itemController,
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
      .post(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        workOrderController.create
      )
      .get(middleware.authenticateUser, workOrderController.select);

    this.router
      .route("/:id(\\d|\\w{32})")
      .get(middleware.authenticateUser, workOrderController.selectById)
      .patch(middleware.authenticateUser, workOrderController.update)
      .delete(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        workOrderController.delete
      );
  }
}

class WorkDetailRouter extends Router {
  constructor() {
    super();

    this.router
      .route("/")
      .post(middleware.authenticateUser, workDetailController.create)
      .get(middleware.authenticateUser, workDetailController.select);
  }
}

class ItemRouter extends Router {
  constructor() {
    super();

    this.router
      .route("/")
      .get(middleware.authenticateUser, itemController.select)
      .post(middleware.authenticateUser, itemController.create);
  }
}

class ImageRouter extends Router {
  constructor() {
    super();

    this.router
      .route("/")
      .post(imageController.create)
      .get(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        imageController.select
      );

    this.router.route("/:id(\\d|\\w{32})").get(imageController.selectOne);
  }
}

class VideoRouter extends Router {
  constructor() {
    super();

    this.router
      .route("/")
      .post(videoController.create)
      .get(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        videoController.select
      );

    this.router
      .route("/:id(\\d|\\w{32})")
      .get(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        videoController.selectOne
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
const { router: workDetailRouter } = new WorkDetailRouter();
const { router: itemRouter } = new ItemRouter();
export {
  authRouter,
  monitorRouter,
  imageRouter,
  videoRouter,
  workOrderRouter,
  workDetailRouter,
  itemRouter,
};
