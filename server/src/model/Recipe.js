import db from "../db/db.js";
import { StatusCodes } from "http-status-codes";
import RecipeError from "../error/RecipeError.js";
import Ingredient from "./Ingredient.js";
import Step from "./Step.js";

class Recipe {
  constructor(
    id,
    name,
    estimated_time,
    num_people,
    image,
    created = 0,
    ingredients,
    steps
  ) {
    this.id = id;
    this.name = name;
    this.estimated_time = estimated_time;
    this.num_people = num_people;
    this.image = image;
    this.created = created;
    this.ingredients = ingredients;
    this.steps = steps;
  }

  async create() {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO recipe (name, estimated_time, num_people, image, created) VALUES (?, ?, ?, ?, ?)`,
        [
          this.name,
          this.estimated_time,
          this.num_people,
          this.image,
          this.created,
        ],
        function (err) {
          if (err) {
            return reject(err);
          }
          const recipeId = this.lastID;
          resolve(
            new Recipe(
              recipeId,
              this.name,
              this.estimated_time,
              this.num_people,
              this.image,
              this.created
            )
          );
        }
      );
    });
  }

  static async getAllRecipes() {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT id, name, estimated_time, num_people, image, created FROM recipe`,
        (err, rows) => {
          if (err)
            return reject(
              new RecipeError(
                "Failed to fetch recipes",
                StatusCodes.INTERNAL_SERVER_ERROR
              )
            );

          resolve(
            rows.map(
              (row) =>
                new Recipe(
                  row.id,
                  row.name,
                  row.estimated_time,
                  row.num_people,
                  row.image,
                  row.created
                )
            )
          );
        }
      );
    });
  }

  static async getRecipeById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT id, name, estimated_time, num_people, image, created FROM recipe WHERE id = ?`,
        [id],
        async (err, row) => {
          if (err) return reject(err);

          if (!row) {
            return reject(RecipeError.NotFound());
          }

          const ingredients = await Ingredient.getIngredientsByRecipeId(id);
          const steps = await Step.getStepsByRecipeId(id);

          const recipe = new Recipe(
            row.id,
            row.name,
            row.estimated_time,
            row.num_people,
            row.image,
            row.created,
            ingredients,
            steps
          );

          resolve(recipe);
        }
      );
    });
  }

  async setCreatedTrue() {
    return new Promise((resolve, reject) => {
      db.run(`UPDATE recipe SET created = 1 WHERE id = ?`, [this.id], (err) => {
        if (err) {
          return reject(err);
        }
        this.created = true;
        resolve(true);
      });
    });
  }

  async delete() {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM recipe WHERE id = ?`, [this.id], function (err) {
        if (err) {
          return reject(err);
        }

        resolve(true);
      });
    });
  }
}

export default Recipe;
