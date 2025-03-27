import { StatusCodes } from "http-status-codes";

class IngredientError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }

  static NotFound(message = "Ingredient not found") {
    return new IngredientError(message, StatusCodes.NOT_FOUND);
  }
}

export default IngredientError;
