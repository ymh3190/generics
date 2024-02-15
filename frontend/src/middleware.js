import util from "./util";

class Middleware {
  locals(req, res, next) {
    res.locals.url = req.url;
    next();
  }

  authenticateUser(req, res, next) {
    try {
      const cookies = req.headers.cookie.split("; ");

      const access_token = cookies.find((e) => e.startsWith("access_token"));
      if (access_token) {
        const payload = util.parseToken(access_token);
        res.locals.user = payload.user;
        return next();
      }

      const refresh_token = cookies.find((e) => e.startsWith("refresh_token"));
      const payload = util.parseToken(refresh_token);
      res.locals.user = payload.user;
      next();
    } catch (error) {
      return res.redirect("/signin");
    }
  }

  authorizePermissions(...roles) {
    return (req, res, next) => {
      if (!roles.includes(res.locals.user.role)) {
        return res.redirect("/signin");
      }
      next();
    };
  }

  unauthenticateUser(req, res, next) {
    try {
      const cookies = req.headers.cookie.split("; ");

      const access_token = cookies.find((e) => e.startsWith("access_token"));
      if (access_token) {
        return res.redirect("/");
      }

      const refresh_token = cookies.find((e) => e.startsWith("refresh_token"));
      if (refresh_token) {
        return res.redirect("/");
      }
    } catch (error) {}
    next();
  }

  notFound(req, res) {
    return res
      .status(404)
      .render("error", { pageTitle: "404", message: "Route not found" });
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
