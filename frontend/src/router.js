import express from "express";
import {
  authController,
  clientController,
  itemController,
  remnantDetailController,
  remnantZoneController,
  rootController,
  userController,
  workDetailController,
  workOrderController,
} from "./controller";
import middleware from "./middleware";

class Router {
  constructor() {
    this.router = express.Router();
  }
}

class RootRouter extends Router {
  constructor() {
    super();

    this.router.get("/", middleware.tokenExists, rootController.getIndex);

    this.router.get(
      "/work-order",
      middleware.tokenExists,
      rootController.getWorkOrder
    );

    this.router.get(
      "/remnant",
      middleware.tokenExists,
      rootController.getRemnant
    );

    this.router.get("/image", middleware.tokenExists, rootController.getImage);

    this.router.get(
      "/signin",
      middleware.tokenNotExists,
      rootController.getSignin
    );

    this.router.get(
      "/signup",
      middleware.tokenNotExists,
      rootController.getSignup
    );

    this.router.get(
      "/watch/:id(\\d|\\w{32})",
      middleware.tokenExists,
      rootController.getWatch
    );

    this.router.get(
      "/client",
      middleware.tokenExists,
      rootController.getClient
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
      middleware.tokenExists,
      authController.signout
    );
  }
}

class ClientRouter extends Router {
  constructor() {
    super();

    this.router.route("/").get(clientController.select);

    this.router.route("/:id(\\d|\\w{32})").get(clientController.selectById);
  }
}

class WorkOrderRouter extends Router {
  constructor() {
    super();

    this.router
      .route("/")
      .post(middleware.tokenExists, workOrderController.create);
    // .get(middleware.tokenExists, workOrderController.select);

    this.router
      .route("/:id(\\d|\\w{32})")
      .get(middleware.tokenExists, workOrderController.selectById);

    this.router.post(
      "/date",
      middleware.tokenExists,
      workOrderController.select
    );

    this.router.get(
      "/:id(\\d|\\w{32})/details",
      middleware.tokenExists,
      workDetailController.selectByWorkOrderId
    );
  }
}

class WorkDetailRouter extends Router {
  constructor() {
    super();

    this.router.route("/").post(workDetailController.create);

    // this.router
    //   .route("/:id(\\d|\\w{32})")
    //   .patch(workDetailController.update)
    //   .delete(workDetailController.delete);
  }
}

class ItemRouter extends Router {
  constructor() {
    super();

    this.router
      .route("/")
      .post(middleware.tokenExists, itemController.create)
      .get(middleware.tokenExists, itemController.select);

    this.router
      .route("/:id(\\d|\\w{32})")
      .get(middleware.tokenExists, itemController.selectById);
  }
}

class RemnantZoneRouter extends Router {
  constructor() {
    super();

    this.router
      .route("/")
      .post(middleware.tokenExists, remnantZoneController.create)
      .get(middleware.tokenExists, remnantZoneController.select);

    this.router
      .route("/:id(\\d|\\w{32})")
      .get(middleware.tokenExists, remnantZoneController.selectById);
    // .patch(remnantZoneController.update)
    // .delete(remnantZoneController.delete);
  }
}

class RemnantDetailRouter extends Router {
  constructor() {
    super();

    this.router
      .route("/")
      .post(middleware.tokenExists, remnantDetailController.create)
      .get(middleware.tokenExists, remnantDetailController.select);

    // this.router
    //   .route("/:id(\\d|\\w{32})")
    //   .get(remnantDetailController.selectById)
    //   .patch(remnantDetailController.update)
    //   .delete(remnantDetailController.delete);
  }
}

class UserRouter extends Router {
  constructor() {
    super();

    // this.router
    //   .route("/")
    //   .get(
    //     middleware.authenticateUser,
    //     middleware.authorizePermissions("admin"),
    //     userController.select
    //   );

    this.router
      .route("/:id(\\d|\\w{32})")
      .get(middleware.tokenExists, userController.selectById);
  }
}

export const { router: rootRouter } = new RootRouter();
export const { router: authRouter } = new AuthRouter();
export const { router: workOrderRouter } = new WorkOrderRouter();
export const { router: clientRouter } = new ClientRouter();
export const { router: workDetailRouter } = new WorkDetailRouter();
export const { router: itemRouter } = new ItemRouter();
export const { router: remnantDetailRouter } = new RemnantDetailRouter();
export const { router: remnantZoneRouter } = new RemnantZoneRouter();
export const { router: userRouter } = new UserRouter();
