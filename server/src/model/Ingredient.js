import db from "../db/db.js";
import IngredientError from "../error/IngredientError.js";

class Ingredient {
  constructor(id, name, unit, value, recipeId) {
    this.id = id;
    this.name = name;
    this.unit = unit;
    this.value = value;
    this.recipeId = recipeId;
  }

  async create() {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO ingredient (name, unit, value, recipe) VALUES (?, ?, ?, ?)`,
        [this.name, this.unit, this.value, this.recipeId],
        function (err) {
          if (err) {
            return reject(err);
          }
          resolve(this.lastID);
        }
      );
    }).then((id) => {
      this.id = id;
      return true;
    });
  }

  async updateIngredient(id, newName = null, newValue = null, newUnit = null) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const params = [];

      if (newName) {
        fields.push("name = ?");
        params.push(newName);
      }
      if (newValue) {
        fields.push("value = ?");
        params.push(newValue);
      }
      if (newUnit) {
        fields.push("unit = ?");
        params.push(newUnit);
      }

      if (fields.length === 0) {
        return reject(new Error("Nessun campo da aggiornare"));
      }

      params.push(id);

      const query = `UPDATE ingredient SET ${fields.join(", ")} WHERE id = ?`;

      db.run(query, params, (err) => {
        if (err) {
          return reject(err);
        }

        if (newName) this.name = newName;
        if (newValue) this.value = newValue;
        if (newUnit) this.unit = newUnit;

        resolve(this);
      });
    });
  }

  static async getIngredientById(ingredientId) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT id, name, unit, value, recipe FROM ingredient WHERE id = ?`,
        [ingredientId],
        (err, row) => {
          if (err) return reject(err);
          if (!row) return reject(IngredientError.NotFound());

          resolve(
            new Ingredient(row.id, row.name, row.unit, row.value, row.recipe)
          );
        }
      );
    });
  }

  static async getIngredientsByRecipeId(recipeId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT id, name, unit, value FROM ingredient WHERE recipe = ?`,
        [recipeId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(
            rows.map(
              (row) =>
                new Ingredient(row.id, row.name, row.unit, row.value, recipeId)
            )
          );
        }
      );
    });
  }

  async delete() {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM ingredient WHERE id = ?`, [this.id], (err) => {
        if (err) {
          return reject(err);
        }
        resolve(true);
      });
    });
  }
}

export default Ingredient;
