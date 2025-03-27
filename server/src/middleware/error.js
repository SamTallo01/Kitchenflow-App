import { StatusCodes } from "http-status-codes";
import RecipeError from "../error/RecipeError.js";
import BadgeError from "../error/BadgeError.js";
import StepError from "../error/StepError.js";

/**
 * This should be the last middleware for all routes,
 * it handles unhandled errors
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(error, request, response, next) {
  if (
    error instanceof RecipeError ||
    error instanceof BadgeError ||
    error instanceof StepError
  ) {
    response.status(error.statusCode).json({ message: error.message });
  } else {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred on the server";
    console.log(message);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
  }
}
