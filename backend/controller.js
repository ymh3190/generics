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
  memory(req, res) {
    const data = memInfo.used;
    res.status(200).json(data);
  }
}

class AuthController extends ApiController {
  async signup(req, res) {}

  async signin(req, res) {
    const { username, password } = req.body;
  }

  async signout(req, res) {}
}

export const rootController = new RootController();
export const apiController = new ApiController();
export const authController = new AuthController();
