import FetchAPI from "./fetch-api";
import * as CustomError from "./error";

class RootController {
  constructor() {
    this.views = {
      index: "index",
      signin: "signin",
      signup: "signup",
      watch: "watch",
      video: "video",
    };

    this.options = {
      index: { pageTitle: "Generics", images: null, user: null },
      signup: { pageTitle: "Sign up" },
      signin: { pageTitle: "Sign in" },
      watch: { pageTitle: null, video: null, user: null },
      video: { pageTitle: "Video", videos: null, user: null },
    };
  }

  async getIndex(req, res) {
    if (!req.headers.cookie) {
      return res.redirect("/signin");
    }

    const response = await FetchAPI.get("/images", {
      headers: { cookie: req.headers.cookie },
    });
    const data = await response.json();
    this.options.index.images = data.images;
    this.options.index.user = data.user;
    res.status(200).render(this.views.index, this.options.index);
  }

  async getWatch(req, res) {
    const { id } = req.params;

    const response = await FetchAPI.get(`/videos/${id}`, {
      headers: { cookie: req.headers.cookie },
    });
    const data = await response.json();
    this.options.watch.video = data.video;
    this.options.watch.user = data.user;
    res.status(200).render(this.views.watch, this.options.watch);
  }

  async getSignup(req, res) {
    res.status(200).render(this.views.signup, this.options.signup);
  }

  async getSignin(req, res) {
    res.status(200).render(this.views.signin, this.options.signin);
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
    res.status(200).end();
  }

  async signin(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new CustomError.BadRequestError("Provide username and password");
    }

    const response = await FetchAPI.post("/auth/signin", {
      username,
      password,
    });
    const data = await response.json();
    const cookies = response.headers.raw()["set-cookie"];
    const access_token = cookies[0];
    const refresh_token = cookies[1];
    res.cookie(access_token);
    res.cookie(refresh_token);
    return res.status(200).json({ user: data.user });
  }

  async signout(req, res) {
    if (!req.headers.cookie) {
      return res.redirect("/signin");
    }

    const response = await FetchAPI.delete("/auth/signout", {
      method: "DELETE",
      headers: { cookie: req.headers.cookie },
    });
    const cookies = response.headers.raw()["set-cookie"];
    const access_token = cookies[0];
    const refresh_token = cookies[1];
    res.cookie(access_token);
    res.cookie(refresh_token);
    res.status(200).end();
  }
}

const rootController = new RootController();
const authController = new AuthController();
// const monitorController = new MonitorController();
export { rootController, authController /* monitorController */ };
