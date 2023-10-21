class RootController {
  constructor() {
    this.page = { index: "contents/index" };
    this.agrs = { index: {} };
  }

  getIndex(req, res) {
    res.status(200).render(this.page.index, this.agrs.index);
  }
}

export const rootController = new RootController();
