import db from "../db/db.js";
import StepError from "../error/StepError.js";

class Step {
  constructor(
    id,
    name,
    description,
    image,
    estimatedTime,
    stepNumber,
    precedence,
    recipeId
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.estimatedTime = estimatedTime;
    this.stepNumber = stepNumber;
    this.precedence = precedence;
    this.recipeId = recipeId;
  }

  async create() {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO step (name, description, image, estimatedTime, stepNumber, precedence, recipe) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          this.name,
          this.description,
          this.image,
          this.estimatedTime,
          this.stepNumber,
          this.precedence,
          this.recipeId,
        ],
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

  async updateName(newName) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE step SET name = ? WHERE id = ?`,
        [newName, this.id],
        (err) => {
          if (err) {
            return reject(err);
          }
          this.name = newName;
          resolve(this);
        }
      );
    });
  }

  static async getStepById(stepId) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT id, name, description, image, estimatedTime, stepNumber, precedence, recipe AS recipeId FROM step WHERE id = ?`,
        [stepId],
        (err, row) => {
          if (err) return reject(err);
          if (!row) return reject(StepError.NotFound());

          resolve(
            new Step(
              row.id,
              row.name,
              row.description,
              row.image,
              row.estimatedTime,
              row.stepNumber,
              row.precedence,
              row.recipeId
            )
          );
        }
      );
    });
  }

  static async getStepsByRecipeId(recipeId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT id, name, description, image, estimatedTime, stepNumber, precedence FROM step WHERE recipe = ?`,
        [recipeId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(
            rows.map(
              (row) =>
                new Step(
                  row.id,
                  row.name,
                  row.description,
                  row.image,
                  row.estimatedTime,
                  row.stepNumber,
                  row.precedence,
                  recipeId
                )
            )
          );
        }
      );
    });
  }
}

export default Step;
