import { Video } from "./db";

/**
 * @abstract
 */
class RenderController {
  constructor() {
    this.views = {};
    this.options = {};
  }
}

class RootController extends RenderController {
  constructor() {
    super();
    this.views.index = "contents/index";
    this.options.index = { pageTitle: "Index" };
  }

  getIndex(req, res) {
    res.status(200).render(this.views.index, this.options.index);
  }
}

class ApiController {
  constructor() {}
}

export const rootController = new RootController();
