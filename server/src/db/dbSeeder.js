import db from "./db.js";

db.serialize(() => {
  db.run(`DELETE FROM ingredient;`);
  db.run(`DELETE FROM step;`);
  db.run(`DELETE FROM badge;`);
  db.run(`DELETE FROM recipe;`);

  db.run(`DELETE FROM sqlite_sequence WHERE name='ingredient';`);
  db.run(`DELETE FROM sqlite_sequence WHERE name='step';`);
  db.run(`DELETE FROM sqlite_sequence WHERE name='badge';`);
  db.run(`DELETE FROM sqlite_sequence WHERE name='recipe';`);

  db.run(
    `INSERT INTO recipe (name, estimated_time, num_people, image, created) VALUES ('Amatriciana', 30, 1, "", 0);`
  );

  db.run(
    `INSERT INTO ingredient (name, unit, value, recipe) 
        VALUES ('Bucatini', 'grams', 400, 1), 
               ('Guanciale', 'grams', 160, 1), 
               ('Tomato sauce', 'grams', 200, 1), 
               ('Red wine', 'milliliters', 100, 1), 
               ('Pecorino cheese', 'grams', 100, 1);`
  );

  db.run(
    `INSERT INTO step (name, description, estimatedTime, stepNumber, precedence, recipe) 
        VALUES ('Prepare Guanciale', 'Cut the guanciale into small strips.', 120, 1, "", 1),
               ('Cook Guanciale', 'Heat a skillet over medium heat and cook the guanciale until crispy.', 150, 2, "0", 1),
               ('Deglaze with Wine', 'Deglaze the skillet with red wine and let it evaporate.', 30, 3, "1", 1),
               ('Simmer Tomato Sauce', 'Add the tomato sauce to the skillet and simmer for 10 minutes.', 600, 4, "2", 1),
               ('Cook Bucatini', 'Cook the bucatini in salted boiling water until al dente.', 720, 5, "", 1),
               ('Drain Pasta', 'Drain the bucatini, reserving some pasta water.', 5, 6, "4", 1),
               ('Combine Pasta and Sauce', 'Mix the bucatini with the sauce, adding reserved pasta water if needed.', 5, 7, "3,5", 1),
               ('Add Pecorino Cheese', 'Sprinkle with grated pecorino cheese and stir to combine.', 5 , 8, "6", 1),
               ('Serve Dish', 'Serve hot with additional pecorino cheese on top.', 5, 9, "7", 1);`
  );

  db.run(`
    INSERT INTO badge (name, description, hint, unlocked, redeemable) 
    VALUES 
      ('1st', 'First recipe! Create your first recipe.', ' ', 1, 0),
      ('40 min', 'Under 40 minutes! Create and cook a recipe in less than 40 minutes.', ' ', 1, 0),
      ('Fasta Pasta', 'Cook a pasta dish in less then 30 minutes.', 'Try to speed up your pasta cooking time!', 0, 0),
      ('x5', '5 Recipes! Creating and preparing 5 different recipes.', 'Try making new stuff!', 0, 0),
      ('Japan!', 'You are trendy! ', 'Try to cook a recipe from a different country!', 0, 0),
      ('Masterchef', 'You are the best! ', 'Try to create and complete a long recipe!', 0, 0),
      ('Time Saver', 'You saved 1 hour of time by using the app', 'Save a lot of time by using the app!', 0, 0);
  `);
});
