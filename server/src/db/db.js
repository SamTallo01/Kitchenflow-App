import sqlite from "sqlite3";

const db = new sqlite.Database("./src/db/kitchenflow.db", (err) => {
  if (err) {
    throw err;
  }

  console.log("Connected to the SQLite database.");
});

export default db;
