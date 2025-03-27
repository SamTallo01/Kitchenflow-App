import { StatusCodes } from "http-status-codes";

class BadgeError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }

  static NotFound(message = "Badge not found") {
    return new BadgeError(message, StatusCodes.NOT_FOUND);
  }
}

export default BadgeError;
