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

    this.router.get("/", middleware.authenticateUser, rootController.getIndex);

    this.router.get(
      "/work-order",
      middleware.authenticateUser,
      middleware.authorizePermissions("admin"),
      rootController.getWorkOrder
    );

    this.router.get(
      "/remnant",
      middleware.authenticateUser,
      middleware.authorizePermissions("admin"),
      rootController.getRemnant
    );

    this.router.get(
      "/signin",
      middleware.unauthenticateUser,
      rootController.getSignin
    );

    this.router.get(
      "/signup",
      middleware.unauthenticateUser,
      rootController.getSignup
    );

    this.router.get(
      "/client",
      middleware.authenticateUser,
      middleware.authorizePermissions("admin"),
      rootController.getClient
    );

    this.router.get(
      "/field",
      middleware.authenticateUser,
      rootController.getField
    );
  }
}

class AuthRouter extends Router {
  constructor() {
    super();

    this.router.post(
      "/signup",
      middleware.unauthenticateUser,
      authController.signup
    );

    this.router.post(
      "/signin",
      middleware.unauthenticateUser,
      authController.signin
    );

    this.router.delete(
      "/signout",
      middleware.authenticateUser,
      authController.signout
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
      );
    // .get(middleware.authenticateUser, workOrderController.select);

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

    this.router.post(
      "/date",
      middleware.authenticateUser,
      middleware.authorizePermissions("admin"),
      workOrderController.select
    );

    this.router.post(
      "/client",
      middleware.authenticateUser,
      middleware.authorizePermissions("admin"),
      workOrderController.select
    );

    this.router.get(
      "/:id(\\d|\\w{32})/details",
      middleware.authenticateUser,
      middleware.authorizePermissions("admin"),
      workDetailController.selectByWorkOrderId
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
      );
    // .patch(remnantZoneController.update)
    // .delete(remnantZoneController.delete);
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
      );
    // .patch(remnantDetailController.update)
    // .delete(remnantDetailController.delete);
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
      .get(
        middleware.authenticateUser,
        middleware.authorizePermissions("admin"),
        userController.selectById
      );
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
