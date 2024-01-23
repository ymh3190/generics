import FetchAPI from "./fetch-api";
import * as CustomError from "./error";

class RootController {
  async getWorkOrder(req, res) {
    const response = await FetchAPI.get("/work-orders", {
      headers: { cookie: req.headers.cookie },
    });

    const data = await response.json();
    const user = data.user;
    const workOrders = data.workOrders;

    const cookies = response.headers.raw()["set-cookie"];
    if (!cookies) {
      return res
        .status(200)
        .render("work-order", { pageTitle: "Generics", workOrders, user });
    }

    const access_token = cookies.find((el) => el.startsWith("access_token"));
    const refresh_token = cookies.find((el) => el.startsWith("refresh_token"));
    res.cookie(access_token);
    res.cookie(refresh_token);
    res
      .status(200)
      .render("work-order", { pageTitle: "Generics", workOrders, user });
  }

  async getImage(req, res) {
    const response = await FetchAPI.get("/images", {
      headers: { cookie: req.headers.cookie },
    });

    const data = await response.json();
    const user = data.user;
    const images = data.images;

    const cookies = response.headers.raw()["set-cookie"];
    if (!cookies) {
      return res
        .status(200)
        .render("image", { pageTitle: "Generics", images, user });
    }

    const access_token = cookies.find((el) => el.startsWith("access_token"));
    const refresh_token = cookies.find((el) => el.startsWith("refresh_token"));
    res.cookie(access_token);
    res.cookie(refresh_token);
    res.status(200).render("image", { pageTitle: "Generics", images, user });
  }

  async getWatch(req, res) {
    const { id } = req.params;

    let response = await FetchAPI.get(`/videos/${id}`, {
      headers: { cookie: req.headers.cookie },
    });

    let data = await response.json();
    const user = data.user;
    const video = data.video;

    response = await FetchAPI.get(`/images/${id}`, {
      headers: { cookie: req.headers.cookie },
    });

    data = await response.json();
    const image = data.image;

    res.status(200).render("watch", { pageTitle: id, image, video, user });
  }

  async getSignup(req, res) {
    res.status(200).render("signup", { pageTitle: "Sign up" });
  }

  async getSignin(req, res) {
    res.status(200).render("signin", { pageTitle: "Sign in" });
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
    // const data = await response.json();

    const cookies = response.headers.raw()["set-cookie"];
    const access_token = cookies.find((el) => el.startsWith("access_token"));
    const refresh_token = cookies.find((el) => el.startsWith("refresh_token"));

    // const reg = /Expires=((\w|\,|\s|\:)+)/;
    // const expiration = refresh_token.match(reg)[1];

    res.cookie(access_token);
    res.cookie(refresh_token);
    res.status(200).end();

    // res.status(200).json({
    //   data: data.user.user_id,
    //   expiration: new Date(expiration).getTime(),
    //   creation: new Date().getTime(),
    // });
  }

  async signout(req, res) {
    const response = await FetchAPI.delete("/auth/signout", {
      method: "DELETE",
      headers: { cookie: req.headers.cookie },
    });

    const cookies = response.headers.raw()["set-cookie"];
    const access_token = cookies.find((el) => el.startsWith("access_token"));
    const refresh_token = cookies.find((el) => el.startsWith("refresh_token"));
    res.cookie(access_token);
    res.cookie(refresh_token);
    res.status(200).end();
  }

  async testSession(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new CustomError.BadRequestError("Provide username and password");
    }

    const ip = req.ip;
    const userAgent = req.headers["user-agent"];

    const response = await FetchAPI.post(
      "/auth/test",
      { username, password },
      { ip, userAgent }
    );

    const cookies = response.headers.raw()["set-cookie"];
    if (!cookies) {
      return res.status(200).end();
    }

    const sId = cookies.find((el) => el.startsWith("sId"));
    res.cookie(sId);
    res.status(200).end();
  }
}

class ClientController {
  async selectById(req, res) {
    const { id } = req.params;

    const response = await FetchAPI.get(`/clients/${id}`, {
      headers: { cookie: req.headers.cookie },
    });
    const data = await response.json();
    const association = data.client.association;
    const name = data.client.name;
    res.status(200).json({ association, name });
  }
}

class WorkOrderController {}

export const rootController = new RootController();
export const authController = new AuthController();
export const workOrderController = new WorkOrderController();
export const clientController = new ClientController();
