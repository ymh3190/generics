import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import memInfo from "./ssh";
import { Image, User, Video, Token } from "./db";

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

    this.views.watch = "watch";
    this.options.watch = { pageTitle: null, video: null };

    this.views.video = "video";
    this.options.video = { pageTitle: "Video", videos: null };

    this.views.signin = "signin";
    this.options.signin = { pageTitle: "Signin" };

    this.views.signup = "signup";
    this.options.signup = { pageTitle: "Signup" };
  }

  async getIndex(req, res) {
    const images = await Image.select({});
    this.options.index.images = images;
    this.options.index.user = req.user;
    res.status(200).render(this.views.index, this.options.index);
  }

  async getWatch(req, res) {
    const { id } = req.params;
    if (!id) throw new Error("Provide video id");
    const video = await Video.selectById(id);
    if (!video) throw new Error("Video not found");
    this.options.watch.pageTitle = video.id;
    this.options.watch.video = video;
    this.options.watch.user = req.user;
    res.status(200).render(this.views.watch, this.options.watch);
  }

  async getVideo(req, res) {
    const videos = await Video.select({});
    this.options.video.pageTitle = "Video";
    this.options.video.videos = videos;
    this.options.video.user = req.user;
    res.status(200).render(this.views.video, this.options.video);
  }

  async getSignin(req, res) {
    this.options.signin.pageTitle = "Signin";
    res.status(200).render(this.views.signin, this.options.signin);
  }

  async getSignup(req, res) {
    this.options.signup.pageTitle = "Signup";
    res.status(200).render(this.views.signup, this.options.signup);
  }
}

class ApiController {
  async auth(req, res) {
    const { username, password } = req.body;
    if (!username) throw new Error("Provide username");
    if (!password) throw new Error("Provide password");
    const hash = await bcrypt.hash(password, 10);
    const hex = crypto.randomFillSync(Buffer.alloc(16)).toString("hex");
    // no token
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn });
    // token exist
    await User.create({ hex, username, hash });
    res.status(201).json({ msg: "200" });
  }

  async signin(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new Error("Provide username and password");
    }

    const user = await User.selectOne({ username });
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error("Unauthorized");
    }

    const tokenUser = {
      username: user.username,
      user_id: user.id,
      role: user.role,
    };
    let refreshToken = "";

    const existingToken = await Token.selectOne({ user_id: user.id });
    if (existingToken) {
      const { is_valid } = existingToken;
      if (!is_valid) {
        throw new Error("Unauthenticated error");
      }
      refreshToken = existingToken.refresh_token;
      const accessTokenJWT = jwt.sign(
        { user: tokenUser },
        process.env.JWT_SECRET
      );
      const refreshTokenJWT = jwt.sign(
        { user: tokenUser, refresh_token: refreshToken },
        process.env.JWT_SECRET
      );

      const oneDay = 1000 * 60 * 60 * 24;
      const thirtyDay = 1000 * 60 * 60 * 24 * 30;
      res.cookie("access_token", accessTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        signed: true,
        expires: new Date(Date.now() + oneDay),
      });

      res.cookie("refresh_token", refreshTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        signed: true,
        expires: new Date(Date.now() + thirtyDay),
      });

      res.status(200).json({ user: tokenUser });
      return;
    }

    refreshToken = crypto.randomBytes(20).toString("hex");
    const userAgent = req.headers["user-agent"];
    const ip = req.ip;
    const userToken = {
      refresh_token: refreshToken,
      ip,
      user_agent: userAgent,
      user_id: user.id,
    };
    await Token.create(userToken);

    const accessTokenJWT = jwt.sign(
      { user: tokenUser },
      process.env.JWT_SECRET
    );
    const refreshTokenJWT = jwt.sign(
      { user: tokenUser, refresh_token: refreshToken },
      process.env.JWT_SECRET
    );

    const oneDay = 1000 * 60 * 60 * 24;
    const thirtyDay = 1000 * 60 * 60 * 24 * 30;
    res.cookie("access_token", accessTokenJWT, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      signed: true,
      expires: new Date(Date.now() + oneDay),
    });

    res.cookie("refresh_token", refreshTokenJWT, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      signed: true,
      expires: new Date(Date.now() + thirtyDay),
    });

    res.status(200).json({ user: tokenUser });
  }

  memory(req, res) {
    const data = memInfo.used;
    res.status(200).json(data);
  }

  async signout(req, res) {
    await Token.selectOne({ user_id: req.user.user_id });

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

export const rootController = new RootController();
export const apiController = new ApiController();
