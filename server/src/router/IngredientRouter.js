import { Router } from "express";
import Ingredient from "../model/Ingredient.js";
import { StatusCodes } from "http-status-codes";

class IngredientRouter {
  constructor() {
    this.router = Router({ mergeParams: true });
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Get all ingredients for a specific recipe
    this.router.get("/", async (req, res, next) => {
      const { recipeId } = req.params;
      try {
        const ingredients = await Ingredient.getIngredientsByRecipeId(recipeId);
        res.status(StatusCodes.OK).json(ingredients);
      } catch (error) {
        next(error);
      }
    });

    // Create a new ingredient
    this.router.post("/", async (req, res, next) => {
      const { recipeId } = req.params;
      const { name, unit, value } = req.body;
      try {
        const ingredient = new Ingredient(null, name, unit, value, recipeId);
        await ingredient.create();
        res.status(StatusCodes.CREATED).json({ id: ingredient.id });
      } catch (error) {
        next(error);
      }
    });

    // Update of an ingredient
    this.router.patch("/:ingredientId", async (req, res, next) => {
      const { ingredientId } = req.params;
      const { name, value, unit } = req.body;
      try {
        const ingredient = await Ingredient.getIngredientById(ingredientId);
        await ingredient.updateIngredient(ingredientId, name, value, unit);
        res.status(StatusCodes.OK).json({
          message: "Ingredient name updated",
          ingredient: ingredient,
        });
      } catch (error) {
        console.error(error);
        next(error);
      }
    });

    this.router.delete("/:ingredientId", async (req, res, next) => {
      const { ingredientId } = req.params;
      try {
        const ingredient = await Ingredient.getIngredientById(ingredientId);
        await ingredient.delete();
        res
          .status(StatusCodes.OK)
          .json({ message: "Recipe deleted successfully" });
      } catch (error) {
        next(error);
      }
    });
  }
}

export default IngredientRouter;
