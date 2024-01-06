import FetchAPI from "./fetch-api";
import * as CustomError from "./error";

class RootController {
  async getIndex(req, res) {
    if (!req.headers.cookie) {
      return res.redirect("/signin");
    }

    const response = await FetchAPI.get("/images", {
      headers: {
        cookie: req.headers.cookie,
        "x-forwarded-for": req.ip,
        "user-agent": req.headers["user-agent"],
      },
    });
    const data = await response.json();
    const images = data.images;
    const user = data.user;
    const cookies = response.headers.raw()["set-cookie"];
    if (cookies?.length) {
      const [access_token, refresh_token] = cookies;
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
    if (req.headers.cookie) {
      return res.redirect("/");
    }
    res.status(200).render("signup", { pageTitle: "Sign up" });
  }

  async getSignin(req, res) {
    if (req.headers.cookie) {
      return res.redirect("/");
    }
    res.status(200).render("signin", { pageTitle: "Sign in" });
  }
}

class AuthController {
  async signup(req, res) {
    if (req.headers.cookie) {
      return res.redirect("/");
    }

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
    if (req.headers.cookie) {
      return res.redirect("/");
    }

    const { username, password } = req.body;

    if (!username || !password) {
      throw new CustomError.BadRequestError("Provide username and password");
    }

    const ip = req.ip;
    const userAgent = req.headers["user-agent"];
    const payload = { username, password };
    const options = { ip, userAgent };

    const response = await FetchAPI.post("/auth/signin", payload, options);
    const cookies = response.headers.raw()["set-cookie"];
    const [access_token, refresh_token] = cookies;
    res.cookie(access_token);
    res.cookie(refresh_token);
    res.status(200).end();
  }

  async signout(req, res) {
    if (!req.headers.cookie) {
      return res.redirect("/signin");
    }

    const response = await FetchAPI.delete("/auth/signout", {
      method: "DELETE",
      headers: {
        cookie: req.headers.cookie,
        "x-forwarded-for": req.ip,
      },
    });
    const cookies = response.headers.raw()["set-cookie"];
    const [access_token, refresh_token] = cookies;
    res.cookie(access_token);
    res.cookie(refresh_token);
    res.status(200).end();
  }
}

const rootController = new RootController();
const authController = new AuthController();
// const monitorController = new MonitorController();
export { rootController, authController /* monitorController */ };
