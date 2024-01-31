class CustomError extends Error {
  constructor(message) {
    super(message);
  }
}

class BadRequestError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class NotFoundError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class UnauthenticatedError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class UnauthorizedError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class InternalServerError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}

export {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
  InternalServerError,
};
