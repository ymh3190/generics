import FetchAPI from "./fetch-api";
import * as CustomError from "./error";
import util from "./util";
import perf from "./perf";

class RootController {
  getIndex(req, res) {
    res.status(200).render("index", { pageTitle: "Generics" });
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
    const response = await FetchAPI.get("/work-orders", {
      cookie: req.headers.cookie,
    });

    const data = await response.json();
    const workOrders = data.workOrders;

    const cookies = response.headers.raw()["set-cookie"];
    if (!cookies) {
      return res
        .status(200)
        .render("work-order", { pageTitle: "Generics", workOrders /* date */ });
    }

    const access_token = cookies.find((el) => el.startsWith("access_token"));
    const refresh_token = cookies.find((el) => el.startsWith("refresh_token"));
    res.cookie(access_token);
    res.cookie(refresh_token);
    res
      .status(200)
      .render("work-order", { pageTitle: "Generics", workOrders /* date */ });
  }

  async getRemnant(req, res) {
    let response = await FetchAPI.get("/remnant-details", {
      cookie: req.headers.cookie,
    });
    let data = await response.json();
    const remnantDetails = data.remnantDetails;

    response = await FetchAPI.get("/items", {
      cookie: req.headers.cookie,
    });
    data = await response.json();
    const items = data.items;

    response = await FetchAPI.get("/remnant-zones", {
      cookie: req.headers.cookie,
    });
    data = await response.json();
    const remnantZones = data.remnantZones;

    const cookies = response.headers.raw()["set-cookie"];
    if (!cookies) {
      return res.status(200).render("remnant", {
        pageTitle: "Generics",
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
      pageTitle: "Generics",
      remnantDetails,
      items,
      remnantZones,
    });
  }

  async getImage(req, res) {
    const response = await FetchAPI.get("/images", {
      cookie: req.headers.cookie,
    });

    const data = await response.json();
    const images = data.images;

    const cookies = response.headers.raw()["set-cookie"];
    if (!cookies) {
      return res.status(200).render("image", { pageTitle: "Generics", images });
    }

    const access_token = cookies.find((el) => el.startsWith("access_token"));
    const refresh_token = cookies.find((el) => el.startsWith("refresh_token"));
    res.cookie(access_token);
    res.cookie(refresh_token);
    res.status(200).render("image", { pageTitle: "Generics", images });
  }

  async getWatch(req, res) {
    const { id } = req.params;

    let response = await FetchAPI.get(`/videos/${id}`, {
      cookie: req.headers.cookie,
    });
    let data = await response.json();
    const video = data.video;

    response = await FetchAPI.get(`/images/${id}`, {
      cookie: req.headers.cookie,
    });
    data = await response.json();
    const image = data.image;

    res.status(200).render("watch", { pageTitle: id, image, video });
  }

  getSignup(req, res) {
    if (req.headers.cookie) {
      return res.redirect("/");
    }
    res.status(200).render("signup", { pageTitle: "Sign up" });
  }

  getSignin(req, res) {
    if (req.headers.cookie) {
      return res.redirect("/");
    }
    res.status(200).render("signin", { pageTitle: "Sign in" });
  }

  async getClient(req, res) {
    const response = await FetchAPI.get("/clients", {
      cookie: req.headers.cookie,
    });

    const data = await response.json();
    const clients = data.clients;

    const cookies = response.headers.raw()["set-cookie"];
    if (!cookies) {
      return res
        .status(200)
        .render("client", { pageTitle: "Generics", clients });
    }

    const access_token = cookies.find((el) => el.startsWith("access_token"));
    const refresh_token = cookies.find((el) => el.startsWith("refresh_token"));
    res.cookie(access_token);
    res.cookie(refresh_token);
    res.status(200).render("client", { pageTitle: "Generics", clients });
  }

  getField(req, res) {
    res.status(200).render("field", { pageTitle: "Generics" });
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

    const cookies = response.headers.raw()["set-cookie"];
    const access_token = cookies.find((el) => el.startsWith("access_token"));
    const refresh_token = cookies.find((el) => el.startsWith("refresh_token"));

    res.cookie(access_token);
    res.cookie(refresh_token);
    res.status(200).end();
  }

  async signout(req, res) {
    const response = await FetchAPI.delete("/auth/signout", {
      cookie: req.headers.cookie,
    });
    const cookies = response.headers.raw()["set-cookie"];
    const access_token = cookies.find((el) => el.startsWith("access_token"));
    const refresh_token = cookies.find((el) => el.startsWith("refresh_token"));
    res.cookie(access_token);
    res.cookie(refresh_token);
    res.status(200).end();
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
    res.status(201).json({ workOrder: data.workOrder });
  }

  async select(req, res) {
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
    res.status(201).json({ workDetails: data.workDetails });
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
