import cors from "cors";
import express from "express";
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";
import { errorHandler } from "./middleware/error.js";
import RecipeRouter from "./router/RecipeRouter.js";
import BadgeRouter from "./router/BadgeRouter.js";
import StepRouter from "./router/StepRouter.js";
import IngredientRouter from "./router/IngredientRouter.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

const corsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      origin.startsWith("http://192.168.") ||
      origin.startsWith("http://localhost")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Prefixes
const prefix = "/kitchenflow";
const recipePrefix = `${prefix}/recipes`;
const stepsPrefix = `${recipePrefix}/:recipeId/steps`;
const ingredientPrefix = `${recipePrefix}/:recipeId/ingredients`;
const badgePrefix = `${prefix}/badges`;

// Routes
app.use(recipePrefix, new RecipeRouter().router);
app.use(stepsPrefix, new StepRouter().router);
app.use(ingredientPrefix, new IngredientRouter().router);
app.use(badgePrefix, new BadgeRouter().router);

// Error handler middleware. Do not move
app.use(errorHandler);

// Server start

const port = 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`KitchenFlow server listening on port ${port}!`);
});
