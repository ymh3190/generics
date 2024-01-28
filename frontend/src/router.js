import express from "express";
import {
  authController,
  clientController,
  itemController,
  rootController,
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

    this.router.get("/", middleware.tokenExists, rootController.getWorkOrder);

    this.router.get("/images", middleware.tokenExists, rootController.getImage);

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

    this.router.post("/test", authController.testSession);
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

    this.router.route("/").post(workOrderController.create);
    // .get(middleware.tokenExists, workOrderController.select);
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

    this.router.route("/").get(middleware.tokenExists, itemController.select);

    this.router
      .route("/:id(\\d|\\w{32})")
      .get(middleware.tokenExists, itemController.selectById);
  }
}

export const { router: rootRouter } = new RootRouter();
export const { router: authRouter } = new AuthRouter();
export const { router: workOrderRouter } = new WorkOrderRouter();
export const { router: clientRouter } = new ClientRouter();
export const { router: workDetailRouter } = new WorkDetailRouter();
export const { router: itemRouter } = new ItemRouter();
