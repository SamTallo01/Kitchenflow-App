import React from "react";
import "../styles/Ingredients.scss";

function convertToUnitSymbol(unit) {
  const unitMap = {
    grams: "g",
    kilograms: "kg",
    milliliters: "mL",
    liters: "L",
    seconds: "s",
    minutes: "min",
    hours: "h",
  };

  return unitMap[unit.toLowerCase()] || unit; // Ritorna l'unità originale se non trovata
}

function Ingredients(props) {
  return (
    <div className="ingredients">
      <div className="ingredient-title">
        <h2>Ingredients</h2>
      </div>
      <div className="ingredient-list">
        {props.ingredients &&
          props.ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient">
              <h4>
                {ingredient.value * props.portions +
                  convertToUnitSymbol(ingredient.unit) +
                  " " +
                  ingredient.name}
              </h4>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Ingredients;
