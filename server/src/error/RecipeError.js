import { StatusCodes } from "http-status-codes";

class RecipeError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }

  static NotFound(message = "Recipe not found") {
    return new RecipeError(message, StatusCodes.NOT_FOUND);
  }
}

export default RecipeError;
