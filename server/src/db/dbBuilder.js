import db from "./db.js";

db.serialize(() => {
  // recipe
  db.run(
    `CREATE TABLE IF NOT EXISTS recipe (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        estimated_time INTEGER NOT NULL,
        num_people INTEGER,
        image TEXT,
        created BOOLEAN DEFAULT 0
      );`
  );

  // ingredient
  db.run(
    `CREATE TABLE IF NOT EXISTS ingredient (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        unit TEXT,
        value INTEGER,
        recipe INTEGER NOT NULL,
        FOREIGN KEY (recipe) REFERENCES recipe(id) ON DELETE CASCADE
      );`
  );

  // step
  db.run(
    `CREATE TABLE IF NOT EXISTS step (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        image TEXT,
        estimatedTime INTEGER,
        stepNumber INTEGER NOT NULL,
        precedence TEXT,
        recipe INTEGER NOT NULL,
        FOREIGN KEY (recipe) REFERENCES recipe(id) ON DELETE CASCADE
      );`
  );

  // badge
  db.run(
    `CREATE TABLE IF NOT EXISTS badge (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        hint TEXT,
        unlocked INTEGER DEFAULT 0,
        redeemable INTEGER DEFAULT 0
    );`
  );

  console.log("Database tables ensured.");
});
