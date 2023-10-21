class Middleware {
  constructor(siteName) {
    this.localsMiddleware = (req, res, next) => {
      res.locals.siteName = siteName;
      next();
    };
    this.asyncWrapper = (fn) => {
      return async (req, res, next) => {
        try {
          await fn(req, res, next);
        } catch (error) {
          next(error);
        }
      };
    };
  }
}

export const { localsMiddleware, asyncWrapper } = new Middleware("Generics");
