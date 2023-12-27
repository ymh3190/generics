class Middleware {
  asyncWrapper(fn) {
    return async (req, res, next) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  }

  notFound(req, res) {
    const message = "Route not found";
    return res.status(404).render("error", { pageTitle: "404", message });
  }

  errorHandler(err, req, res, next) {
    console.log(err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something wrong";
    return res.status(statusCode).json({ message });
  }
}

const middleware = new Middleware();
export default middleware;
