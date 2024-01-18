import express from "express";
import {
  monitorController,
  authController,
  imageController,
  videoController,
  workOrderController,
  workDetailController,
  workLogController,
  clientController,
  remnantController,
  itemController,
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

class ItemRouter extends Router {
  constructor() {
    super();

    this.router
      .route("/")
      .post(middleware.authenticateUser, itemController.create)
      .get(middleware.authenticateUser, itemController.select);

    this.router
      .route("/:id(\\d|\\w{32})")
      .get(middleware.authenticateUser, itemController.selectById);
  }
}

class ClientRouter extends Router {
  constructor() {
    super();

    this.router
      .route("/")
      .post(middleware.authenticateUser, clientController.create)
      .get(middleware.authenticateUser, clientController.select);

    this.router
      .route("/:id(\\d|\\w{32})")
      .get(middleware.authenticateUser, clientController.selectById)
      .patch(middleware.authenticateUser, clientController.update)
      .delete(middleware.authenticateUser, clientController.delete);
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

    this.router
      .route("/:id(\\d|\\w{32})/details")
      .get(
        middleware.authenticateUser,
        workDetailController.selectByWorkOrderId
      );

    this.router
      .route("/:id(\\d|\\w{32})/logs")
      .get(middleware.authenticateUser, workLogController.selectByWorkOrderId);
  }
}

class WorkDetailRouter extends Router {
  constructor() {
    super();

    this.router
      .route("/")
      .post(middleware.authenticateUser, workDetailController.create);

    this.router
      .route("/:id(\\d|\\w{32})")
      .patch(middleware.authenticateUser, workDetailController.update)
      .delete(middleware.authenticateUser, workDetailController.delete);
  }
}

class WorkLogRouter extends Router {
  constructor() {
    super();

    this.router
      .route("/")
      .post(middleware.authenticateUser, workLogController.create);
  }
}

class RemnantDetailRouter extends Router {
  constructor() {
    super();
  }
}

class RemnantZoneRouter extends Router {
  constructor() {
    super();
  }
}

export const { router: monitorRouter } = new MonitorRouter();
export const { router: imageRouter } = new ImageRouter();
export const { router: videoRouter } = new VideoRouter();
export const { router: authRouter } = new AuthRouter();
export const { router: clientRouter } = new ClientRouter();
export const { router: itemRouter } = new ItemRouter();
export const { router: workOrderRouter } = new WorkOrderRouter();
export const { router: workDetailRouter } = new WorkDetailRouter();
export const { router: workLogRouter } = new WorkLogRouter();
export const { router: remnantDetailRouter } = new RemnantDetailRouter();
export const { router: remnantZoneRouter } = new RemnantZoneRouter();
