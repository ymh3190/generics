class Middleware {
  refreshTokenExists(req, res, next) {
    const cookies = req.headers.cookie?.split("; ");
    const refresh_token = cookies?.find((el) => el.startsWith("refresh_token"));
    if (refresh_token) {
      return next();
    }
    res.redirect("/signin");
  }

  refreshTokenNotExists(req, res, next) {
    const cookies = req.headers.cookie?.split("; ");
    const refresh_token = cookies?.find((el) => el.startsWith("refresh_token"));
    if (refresh_token) {
      return res.redirect("/");
    }
    next();
  }

  sIdExists(req, res, next) {
    const cookies = req.headers.cookie?.split("; ");
    const sId = cookies?.find((el) => el.startsWith("sId"));
    if (sId) {
      return next();
    }
    res.redirect("/signin");
  }

  notFound(req, res) {
    const message = "Route not found";
    return res.status(404).render("error", { pageTitle: "404", message });
  }

  errorHandler(err, req, res, next) {
    console.log(err);
    const error = {
      statusCode: err.statusCode || 500,
      message: err.message || "Something wrong",
    };
    return res.status(error.statusCode).json({ message: error.message });
  }
}

const middleware = new Middleware();
export default middleware;
