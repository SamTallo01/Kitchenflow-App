import { StatusCodes } from "http-status-codes";

class StepError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }

  static NotFound(message = "Step not found") {
    return new StepError(message, StatusCodes.NOT_FOUND);
  }
}

export default StepError;
