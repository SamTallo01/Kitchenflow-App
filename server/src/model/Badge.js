import db from "../db/db.js";
import { StatusCodes } from "http-status-codes";
import BadgeError from "../error/BadgeError.js";

class Badge {
  constructor(id, name, description, hint, unlocked = 0, redeemable = 0) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.hint = hint;
    this.unlocked = unlocked;
    this.redeemable = redeemable;
  }

  async create(name, description, hint) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO badge (name, description, hint) VALUES (?, ?, ?)`,
        [name, description, hint],
        function (err) {
          if (err) {
            return reject(err);
          }
          const badge = new Badge(this.lastID, name, description, hint);
          resolve(badge);
        }
      );
    });
  }

  static async getAllBadges() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM badge`, (err, rows) => {
        if (err)
          return reject(
            new BadgeError(
              "Failed to fetch badges",
              StatusCodes.INTERNAL_SERVER_ERROR
            )
          );

        resolve(
          rows.map(
            (row) =>
              new Badge(
                row.id,
                row.name,
                row.description,
                row.hint,
                row.unlocked,
                row.redeemable
              )
          )
        );
      });
    });
  }

  async updateUnlocked(unlocked) {
    const self = this;
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE badge SET unlocked = ? WHERE id = ?`,
        [unlocked, this.id],
        function (err) {
          if (err) {
            return reject(err);
          }
          if (this.changes === 0) return reject(BadgeError.NotFound());

          resolve(
            unlocked ? `Badge ${self.id} unlocked` : `Badge ${self.id} locked`
          );
        }
      );
    });
  }

  async updateRedeemable(redeemable) {
    const self = this;
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE badge SET redeemable = ? WHERE id = ?`,
        [redeemable, this.id],
        function (err) {
          if (err) {
            return reject(err);
          }
          if (this.changes === 0) return reject(BadgeError.NotFound());

          resolve(
            redeemable ? `Badge ${self.id} redeemable` : `Badge ${self.id} not redeemable`
          );
        }
      );
    });
  }

}

export default Badge;
