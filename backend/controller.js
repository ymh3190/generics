import bcrypt from "bcrypt";
import memInfo from "./ssh";
import { Image, User, Video, Token } from "./db";
import {
  attachCookiesToResponse,
  createId,
  createToken,
  createTokenUser,
} from "./util";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "./error-api";

/** @interface */
class RenderController {
  constructor() {
    this.views = {};
    this.options = {};
  }
}

class RootController extends RenderController {
  constructor() {
    super();

    this.views.index = "index";
    this.options.index = { pageTitle: "Generics", images: null };

    this.views.signin = "signin";
    this.options.signin = { pageTitle: "Sign in" };

    this.views.signup = "signup";
    this.options.signup = { pageTitle: "Sign up" };

    this.views.watch = "watch";
    this.options.watch = { pageTitle: null, video: null };

    this.views.video = "video";
    this.options.video = { pageTitle: "Video", videos: null };
  }

  async getIndex(req, res) {
    const images = await Image.select({});
    this.options.index.images = images;
    this.options.index.user = req.user;
    res.status(200).render(this.views.index, this.options.index);
  }

  async getWatch(req, res) {
    const { id } = req.params;

    const video = await Video.selectJoinById(id);
    if (!video) {
      this.options.watch.pageTitle = "Generics";
      this.options.watch.message = "Video not found";
      return res.status(404).render("error", this.options.watch);
    }

    this.options.watch.pageTitle = video.id;
    this.options.watch.video = video;
    this.options.watch.user = req.user;
    res.status(200).render(this.views.watch, this.options.watch);
  }

  async getVideo(req, res) {
    const videos = await Video.select({});
    this.options.video.videos = videos;
    this.options.video.user = req.user;
    res.status(200).render(this.views.video, this.options.video);
  }

  async getSignin(req, res) {
    res.status(200).render(this.views.signin, this.options.signin);
  }

  async getSignup(req, res) {
    res.status(200).render(this.views.signup, this.options.signup);
  }
}

class AuthController {
  async signup(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new BadRequestError("Provide username and password");
    }

    const existingUser = await User.selectOne({ username });
    if (existingUser) {
      throw new BadRequestError("User already exists");
    }

    const id = createId();
    const hash = await bcrypt.hash(password, 10);
    const role = (await User.select({})).length === 0 ? "admin" : "user";

    await User.create({ id, username, password: hash, role });
    res.status(201).end();
  }

  async signin(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new BadRequestError("Provide username and password");
    }

    const user = await User.selectOne({ username });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new BadRequestError("Password not match");
    }

    const tokenUser = createTokenUser(user);
    let refreshToken = "";
    const existingToken = await Token.selectOne({ user_id: user.id });
    if (existingToken) {
      const { is_valid } = existingToken;
      if (!is_valid) {
        throw new UnauthenticatedError("Authentication invalid");
      }

      refreshToken = existingToken.refresh_token;
      attachCookiesToResponse({
        res,
        user: tokenUser,
        refresh_token: refreshToken,
      });
      return res.status(200).end();
    }

    const id = createId();
    const refresh_token = createToken();
    const ip = req.ip;
    const user_agent = req.headers["user-agent"];
    const user_id = user.id;
    await Token.create({ id, refresh_token, ip, user_agent, user_id });
    attachCookiesToResponse({ res, user: tokenUser, refresh_token });
    res.status(200).end();
  }

  async signout(req, res) {
    await Token.delete({ user_id: req.user.user_id });

    res.cookie("access_token", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.cookie("refresh_token", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(200).end();
  }
}

class MonitorController {
  memory(req, res) {
    const data = memInfo.used;
    res.status(200).json(data);
  }
}

const rootController = new RootController();
const authController = new AuthController();
const monitorController = new MonitorController();
export { rootController, authController, monitorController };
