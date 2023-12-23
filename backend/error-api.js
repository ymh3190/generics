class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class UnauthenticatedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

export {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
};
