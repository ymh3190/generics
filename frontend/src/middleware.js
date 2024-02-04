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
        const payload = JSON.parse(
          Buffer.from(
            access_token.match(/\.(\w+)\./g).join(""),
            "base64"
          ).toString("utf-8")
        );
        res.locals.user = payload.user;
        return next();
      }

      const refresh_token = cookies.find((el) =>
        el.startsWith("refresh_token")
      );
      const payload = JSON.parse(
        Buffer.from(
          refresh_token.match(/\.(\w+)\./g).join(""),
          "base64"
        ).toString("utf-8")
      );
      res.locals.user = payload.user;
      return next();
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
