import util from "./util";

class Middleware {
  locals(req, res, next) {
    res.locals.url = req.url;
    next();
  }

  authenticateUser(req, res, next) {
    try {
      const cookies = req.headers.cookie.split("; ");

      const access_token = cookies.find((el) => el.startsWith("access_token"));
      if (access_token) {
        const payload = util.parseToken(access_token);
        res.locals.user = payload.user;
        return next();
      }

      const refresh_token = cookies.find((el) =>
        el.startsWith("refresh_token")
      );
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
