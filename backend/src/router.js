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
  itemController,
  userController,
  remnantZoneController,
  remnantDetailController,
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

    this.router.route("/:id(\\d|\\w{32})").get(imageController.selectById);
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
        videoController.selectById
      );
  }
}

class UserRouter extends Router {
  constructor() {
    super();

    this.router
      .route("/")
      .get(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        userController.select
      );

    this.router
      .route("/:id(\\d|\\w{32})")
      .get(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        userController.selectById
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
      .post(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        itemController.create
      )
      .get(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        itemController.select
      );

    this.router
      .route("/:id(\\d|\\w{32})")
      .get(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        itemController.selectById
      )
      .patch(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        itemController.update
      )
      .delete(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        itemController.delete
      );
  }
}

class ClientRouter extends Router {
  constructor() {
    super();

    this.router
      .route("/")
      .post(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        clientController.create
      )
      .get(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        clientController.select
      );

    this.router
      .route("/:id(\\d|\\w{32})")
      .get(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        clientController.selectById
      )
      .patch(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        clientController.update
      )
      .delete(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        clientController.delete
      );
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
      .get(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        workOrderController.select
      );

    this.router.post(
      "/date",
      middleware.authenticateUser,
      middleware.authorizePermissions("admin"),
      workOrderController.select
    );

    this.router
      .route("/:id(\\d|\\w{32})")
      .get(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        workOrderController.selectById
      )
      .patch(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        workOrderController.update
      )
      .delete(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        workOrderController.delete
      );

    this.router
      .route("/:id(\\d|\\w{32})/details")
      .get(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        workDetailController.selectByWorkOrderId
      );

    this.router
      .route("/:id(\\d|\\w{32})/logs")
      .get(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        workLogController.selectByWorkOrderId
      );
  }
}

class WorkDetailRouter extends Router {
  constructor() {
    super();

    this.router
      .route("/")
      .post(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        workDetailController.create
      );

    this.router
      .route("/:id(\\d|\\w{32})")
      .patch(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        workDetailController.update
      )
      .delete(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        workDetailController.delete
      );
  }
}

class WorkLogRouter extends Router {
  constructor() {
    super();

    this.router
      .route("/")
      .post(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        workLogController.create
      );
  }
}

class RemnantZoneRouter extends Router {
  constructor() {
    super();

    this.router
      .route("/")
      .post(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        remnantZoneController.create
      )
      .get(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        remnantZoneController.select
      );

    this.router
      .route("/:id(\\d|\\w{32})")
      .get(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        remnantZoneController.selectById
      )
      .patch(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        remnantZoneController.update
      )
      .delete(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        remnantZoneController.delete
      );
  }
}

class RemnantDetailRouter extends Router {
  constructor() {
    super();

    this.router
      .route("/")
      .post(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        remnantDetailController.create
      )
      .get(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        remnantDetailController.select
      );

    this.router
      .route("/:id(\\d|\\w{32})")
      .get(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        remnantDetailController.selectById
      )
      .patch(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        remnantDetailController.update
      )
      .delete(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        remnantDetailController.delete
      );
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
export const { router: remnantZoneRouter } = new RemnantZoneRouter();
export const { router: remnantDetailRouter } = new RemnantDetailRouter();
export const { router: userRouter } = new UserRouter();
