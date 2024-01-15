import FetchAPI from "./fetch-api";
import * as CustomError from "./error";

class RootController {
  async getIndex(req, res) {
    const response = await FetchAPI.get("/images", {
      headers: { cookie: req.headers.cookie },
    });

    const data = await response.json();
    const images = data.images;
    const user = data.user;

    const cookies = response.headers.raw()["set-cookie"];
    if (cookies) {
      const access_token = cookies.find((el) => el.includes("access_token"));
      const refresh_token = cookies.find((el) => el.includes("refresh_token"));
      res.cookie(access_token);
      res.cookie(refresh_token);
    }
    res.status(200).render("index", { pageTitle: "Generics", images, user });
  }

  async getWatch(req, res) {
    const { id } = req.params;

    let response = await FetchAPI.get(`/videos/${id}`, {
      headers: { cookie: req.headers.cookie },
    });

    let data = await response.json();
    const video = data.video;
    const user = data.user;

    response = await FetchAPI.get(`/images/${id}`, {
      headers: { cookie: req.headers.cookie },
    });

    data = await response.json();
    const image = data.image;
    res.status(200).render("watch", { pageTitle: id, image, user, video });
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

    await FetchAPI.post("/auth/signup", {
      username,
      password,
    });
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
    if (cookies) {
      const access_token = cookies.find((el) => el.includes("access_token"));
      const refresh_token = cookies.find((el) => el.includes("refresh_token"));
      res.cookie(access_token);
      res.cookie(refresh_token);
    }
    res.status(200).end();
  }

  async signout(req, res) {
    const response = await FetchAPI.delete("/auth/signout", {
      method: "DELETE",
      headers: { cookie: req.headers.cookie },
    });

    const cookies = response.headers.raw()["set-cookie"];
    if (cookies) {
      const access_token = cookies.find((el) => el.includes("access_token"));
      const refresh_token = cookies.find((el) => el.includes("refresh_token"));
      res.cookie(access_token);
      res.cookie(refresh_token);
    }
    res.status(200).end();
  }

  async test(req, res) {
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
    if (cookies) {
      const sId = cookies.find((el) => el.includes("sId"));
      res.cookie(sId);
    }
    res.status(200).end();
  }
}

const rootController = new RootController();
const authController = new AuthController();
export { rootController, authController };
