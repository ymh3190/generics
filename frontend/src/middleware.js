class Middleware {
  locals(req, res, next) {
    const cookies = req.headers.cookie?.split("; ");
    const access_token = cookies?.find((el) => el.startsWith("access_token"));
    const refresh_token = cookies?.find((el) => el.startsWith("refresh_token"));
    if (access_token || refresh_token) {
      res.locals.auth = true;
      return next();
    }
    res.locals.auth = false;
    next();
  }

  tokenExists(req, res, next) {
    const isAuth = res.locals.auth;
    if (isAuth) {
      return next();
    }
    res.redirect("/signin");
  }

  tokenNotExists(req, res, next) {
    const isAuth = res.locals.auth;
    if (isAuth) {
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
