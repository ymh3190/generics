import FetchAPI from "./fetch-api";
import * as CustomError from "./error";
import orderer from "./alarm";

class RootController {
  getIndex(req, res) {
    res.status(200).render("index", { pageTitle: "Home" });
  }

  async getWorkOrder(req, res) {
    // const { years, months, dates } = util.getDateTime();
    // const date = `${years}-${months}-${dates}`;

    // const response = await FetchAPI.post(
    //   "/work-orders/date",
    //   { created_at: `${years}-${months}-${dates}` },
    //   {
    //     cookie: req.headers.cookie,
    //   }
    // );

    let response;
    try {
      response = await FetchAPI.get("/work-orders", {
        cookie: req.headers.cookie,
      });
    } catch (error) {
      res.cookie("refresh_token", "signout", {
        httpOnly: true,
        expires: new Date(Date.now()),
      });
      return res.status(error.statusCode).render("error", {
        pageTitle: error.statusCode,
        message: error.message,
      });
    }

    // const response = await FetchAPI.get("/work-orders", {
    //   cookie: req.headers.cookie,
    // });

    const data = await response.json();
    const workOrders = data.workOrders;

    const cookies = response.headers.raw()["set-cookie"];
    if (!cookies) {
      return res.status(200).render("work-order", {
        pageTitle: "Work Order",
        workOrders /* date */,
      });
    }

    const access_token = cookies.find((el) => el.startsWith("access_token"));
    const refresh_token = cookies.find((el) => el.startsWith("refresh_token"));
    res.cookie(access_token);
    res.cookie(refresh_token);
    res
      .status(200)
      .render("work-order", { pageTitle: "Work Order", workOrders /* date */ });
  }

  async getRemnant(req, res) {
    let response;
    let remnantDetails, items, remnantZones;

    try {
      response = await FetchAPI.get("/remnant-details", {
        cookie: req.headers.cookie,
      });
      let data = await response.json();
      remnantDetails = data.remnantDetails;

      response = await FetchAPI.get("/items", {
        cookie: req.headers.cookie,
      });
      data = await response.json();
      items = data.items;

      response = await FetchAPI.get("/remnant-zones", {
        cookie: req.headers.cookie,
      });
      data = await response.json();
      remnantZones = data.remnantZones;
    } catch (error) {
      res.cookie("refresh_token", "signout", {
        httpOnly: true,
        expires: new Date(Date.now()),
      });
      return res.status(error.statusCode).render("error", {
        pageTitle: error.statusCode,
        message: error.message,
      });
    }

    const cookies = response.headers.raw()["set-cookie"];
    if (!cookies) {
      return res.status(200).render("remnant", {
        pageTitle: "Remnant",
        remnantDetails,
        items,
        remnantZones,
      });
    }

    const access_token = cookies.find((el) => el.startsWith("access_token"));
    const refresh_token = cookies.find((el) => el.startsWith("refresh_token"));
    res.cookie(access_token);
    res.cookie(refresh_token);
    res.status(200).render("remnant", {
      pageTitle: "Remnant",
      remnantDetails,
      items,
      remnantZones,
    });
  }

  getSignup(req, res) {
    res.status(200).render("signup", { pageTitle: "Sign up" });
  }

  getSignin(req, res) {
    res.status(200).render("signin", { pageTitle: "Sign in" });
  }

  async getClient(req, res) {
    let response;
    try {
      response = await FetchAPI.get("/clients", {
        cookie: req.headers.cookie,
      });
    } catch (error) {
      res.cookie("refresh_token", "signout", {
        httpOnly: true,
        expires: new Date(Date.now()),
      });
      return res.status(error.statusCode).render("error", {
        pageTitle: error.statusCode,
        message: error.message,
      });
    }

    const data = await response.json();
    const clients = data.clients;

    const associations = [
      ...new Set(clients.map((client) => client.association)),
    ];
    const names = [...new Set(clients.map((client) => client.name))];

    const cookies = response.headers.raw()["set-cookie"];
    if (!cookies) {
      return res.status(200).render("client", {
        pageTitle: "Client",
        clients,
        associations,
        names,
      });
    }

    const access_token = cookies.find((el) => el.startsWith("access_token"));
    const refresh_token = cookies.find((el) => el.startsWith("refresh_token"));
    res.cookie(access_token);
    res.cookie(refresh_token);
    res.status(200).render("client", {
      pageTitle: "Client",
      clients,
      associations,
      names,
    });
  }

  getField(req, res) {
    res.status(200).render("field", { pageTitle: "Field" });
  }
}

class AuthController {
  async signup(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new CustomError.BadRequestError("Provide username and password");
    }

    await FetchAPI.post("/auth/signup", { username, password });
    res.status(201).end();
  }

  async signin(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new CustomError.BadRequestError("Provide username and password");
    }

    const ip = req.ip;
    const userAgent = req.headers["user-agent"];

    const response = await FetchAPI.post(
      "/auth/signin",
      { username, password },
      { ip, userAgent }
    );
    const data = await response.json();

    const cookies = response.headers.raw()["set-cookie"];
    const access_token = cookies.find((el) => el.startsWith("access_token"));
    const refresh_token = cookies.find((el) => el.startsWith("refresh_token"));

    res.cookie(access_token);
    res.cookie(refresh_token);
    res.status(200).json({ message: data.message });
  }

  async signout(req, res) {
    const response = await FetchAPI.delete("/auth/signout", {
      cookie: req.headers.cookie,
    });
    const data = await response.json();
    const cookies = response.headers.raw()["set-cookie"];
    const access_token = cookies.find((el) => el.startsWith("access_token"));
    const refresh_token = cookies.find((el) => el.startsWith("refresh_token"));
    res.cookie(access_token);
    res.cookie(refresh_token);
    res.status(200).json({ message: data.message });
  }
}

class ClientController {
  async create(req, res) {
    const response = await FetchAPI.post("/clients", req.body, {
      cookie: req.headers.cookie,
    });
    const data = await response.json();
    res.status(201).json({ client: data.client });
  }

  async select(req, res) {
    const response = await FetchAPI.get("/clients", {
      cookie: req.headers.cookie,
    });
    const data = await response.json();
    res.status(200).json({ clients: data.clients });
  }

  async selectById(req, res) {
    const { id } = req.params;

    const response = await FetchAPI.get(`/clients/${id}`, {
      cookie: req.headers.cookie,
    });
    const data = await response.json();
    res.status(200).json({ client: data.client });
  }
}

class WorkOrderController {
  async create(req, res) {
    const response = await FetchAPI.post("/work-orders", req.body, {
      cookie: req.headers.cookie,
    });
    const data = await response.json();
    orderer.notifyFields("place");
    res.status(201).json({ workOrder: data.workOrder });
  }

  async select(req, res) {
    // req.path: '/date' | '/client'
    const response = await FetchAPI.post(`/work-orders/${req.path}`, req.body, {
      cookie: req.headers.cookie,
    });
    const data = await response.json();

    if (req.path === "/date") {
      return res.status(200).json({ workOrders: data.workOrders });
    }

    // req.path === "/client";
    res.status(200).json({ workOrders: data.workOrders });
  }

  async selectById(req, res) {
    const { id } = req.params;

    const response = await FetchAPI.get(`/work-orders/${id}`, {
      cookie: req.headers.cookie,
    });
    const data = await response.json();
    res.status(200).json({ workOrder: data.workOrder });
  }

  async update(req, res) {
    const { id } = req.params;

    const response = await FetchAPI.patch(`/work-orders/${id}`, req.body, {
      cookie: req.headers.cookie,
    });
    const data = await response.json();
    orderer.notifyFields("update");
    res.status(200).json({ workOrder: data.workOrder });
  }

  async delete(req, res) {
    const { id } = req.params;

    const response = await FetchAPI.delete(`/work-orders/${id}`, {
      cookie: req.headers.cookie,
    });
    const data = await response.json();
    orderer.notifyFields("delete");
    res.status(200).json({ message: data.message });
  }
}

class WorkDetailController {
  async create(req, res) {
    const response = await FetchAPI.post("/work-details", req.body, {
      cookie: req.headers.cookie,
    });
    const data = await response.json();
    res.status(201).json({ workDetail: data.workDetail });
  }

  async selectByWorkOrderId(req, res) {
    const { id } = req.params;
    const response = await FetchAPI.get(`/work-orders/${id}/details`, {
      cookie: req.headers.cookie,
    });
    const data = await response.json();
    res.status(200).json({ workDetails: data.workDetails });
  }

  async update(req, res) {
    const { id } = req.params;

    const response = await FetchAPI.patch(`/work-details/${id}`, req.body, {
      cookie: req.headers.cookie,
    });
    const data = await response.json();
    orderer.notifyFields("update");
    res.status(200).json({ workDetail: data.workDetail });
  }
}

class ItemController {
  async create(req, res) {
    const response = await FetchAPI.post("/items", req.body, {
      cookie: req.headers.cookie,
    });
    const data = await response.json();
    res.status(201).json({ item: data.item });
  }

  async select(req, res) {
    const response = await FetchAPI.get("/items", {
      cookie: req.headers.cookie,
    });
    const data = await response.json();
    res.status(200).json({ items: data.items });
  }

  async selectById(req, res) {
    const { id } = req.params;

    const response = await FetchAPI.get(`/items/${id}`, {
      cookie: req.headers.cookie,
    });
    const data = await response.json();
    res.status(200).json({ item: data.item });
  }
}

class RemnantZoneController {
  async create(req, res) {
    const response = await FetchAPI.post("/remnant-zones", req.body, {
      cookie: req.headers.cookie,
    });
    const data = await response.json();
    res.status(201).json({ remnantZone: data.remnantZone });
  }

  async select(req, res) {
    const response = await FetchAPI.get("/remnant-zones", {
      cookie: req.headers.cookie,
    });
    const data = await response.json();
    res.status(200).json({ remnantZones: data.remnantZones });
  }

  async selectById(req, res) {
    const { id } = req.params;

    const response = await FetchAPI.get(`/remnant-zones/${id}`, {
      cookie: req.headers.cookie,
    });
    const data = await response.json();
    res.status(200).json({ remnantZone: data.remnantZone });
  }

  // async update(req, res) {
  //   const { id } = req.params;

  //   const remnantZone = await RemnantZone.selectByIdAndUpdate(id, req.body, {
  //     new: true,
  //   });
  //   res.status(200).json({ remnantZone });
  // }

  // async delete(req, res) {
  //   const { id } = req.params;

  //   await RemnantZone.selectByIdAndDelete(id);
  //   res.status(200).json({ message: "Delete success" });
  // }
}

class RemnantDetailController {
  async create(req, res) {
    const response = await FetchAPI.post("/remnant-details", req.body, {
      cookie: req.headers.cookie,
    });
    const data = await response.json();
    res.status(201).json({ remnantDetail: data.remnantDetail });

    // const remnantDetail = data.remnantDetail;

    // response = await FetchAPI.get(`/users/${remnantDetail.creator_id}`, {
    //   cookie: req.headers.cookie,
    // });
    // data = await response.json();
    // const creator = data.user.username;

    // res.status(201).json({ remnantDetail, creator });
  }

  async select(req, res) {
    const response = await FetchAPI.get("/remnant-details", {
      cookie: req.headers.cookie,
    });
    const data = await response.json();
    res.status(200).json({ RemnantDetails: data.RemnantDetails });
  }

  async selectById(req, res) {
    const { id } = req.params;

    const response = await FetchAPI.get(`/remnant-details/${id}`, {
      cookie: req.headers.cookie,
    });
    const data = await response.json();
    res.status(200).json({ remnantDetail: data.remnantDetail });
  }

  // async update(req, res) {
  //   const { id } = req.params;

  //   const remnantDetail = await RemnantDetail.selectByIdAndUpdate(
  //     id,
  //     req.body,
  //     { new: true }
  //   );
  //   res.status(200).json({ remnantDetail });
  // }

  // async delete(req, res) {
  //   const { id } = req.params;

  //   await RemnantDetail.selectByIdAndDelete(id);
  //   res.status(200).json({ message: "Delete success" });
  // }
}

class UserController {
  async selectById(req, res) {
    const { id } = req.params;

    const response = await FetchAPI.get(`/users/${id}`, {
      cookie: req.headers.cookie,
    });
    const data = await response.json();
    res.status(200).json({ user: data.user });
  }
}

export const rootController = new RootController();
export const authController = new AuthController();
export const workOrderController = new WorkOrderController();
export const clientController = new ClientController();
export const workDetailController = new WorkDetailController();
export const itemController = new ItemController();
export const remnantDetailController = new RemnantDetailController();
export const remnantZoneController = new RemnantZoneController();
export const userController = new UserController();
