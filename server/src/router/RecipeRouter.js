import { Router } from "express";
import Recipe from "../model/Recipe.js";
import { StatusCodes } from "http-status-codes";

class RecipeRouter {
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/", async (req, res, next) => {
      try {
        const recipes = await Recipe.getAllRecipes();
        res.status(StatusCodes.OK).json(recipes);
      } catch (error) {
        next(error);
      }
    });

    this.router.get("/:id", async (req, res, next) => {
      const { id } = req.params;
      try {
        const recipe = await Recipe.getRecipeById(id);
        res.status(StatusCodes.OK).json(recipe);
      } catch (error) {
        next(error);
      }
    });

    this.router.post("/", async (req, res, next) => {
      const { name, estimated_time, num_people, created = 0 } = req.body;
      try {
        const recipe = new Recipe(
          null,
          name,
          estimated_time,
          num_people,
          created
        );
        const newRecipe = await recipe.create();
        res
          .status(StatusCodes.CREATED)
          .json({ id: newRecipe.id, message: "Recipe created successfully" });
      } catch (error) {
        next(error);
      }
    });

    this.router.patch("/:id", async (req, res, next) => {
      const { id } = req.params;
      const { created } = req.body;

      try {
        const recipe = await Recipe.getRecipeById(id);

        if (created) {
          await recipe.setCreatedTrue();
          return res.status(StatusCodes.OK).json({ message: "Recipe updated" });
        }

        res.status(StatusCodes.BAD_REQUEST).json({
          message: "'created' can only be true.",
        });
      } catch (error) {
        next(error);
      }
    });

    this.router.delete("/:id", async (req, res, next) => {
      const { id } = req.params;
      try {
        const recipe = await Recipe.getRecipeById(id);
        await recipe.delete();
        res
          .status(StatusCodes.OK)
          .json({ message: "Recipe deleted successfully" });
      } catch (error) {
        next(error);
      }
    });
  }
}

export default RecipeRouter;
