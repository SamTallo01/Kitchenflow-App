/* eslint-disable react/prop-types */
import "../styles/CreateEditRecipe.scss";
import { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import DiscardChanges from "./DiscardChanges";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faCheck,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import API from "../API";

function CreateEditRecipe(props) {
  const [isOpenDiscardChanges, setIsOpenDiscardChanges] = useState(false);
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [editingStepId, setEditingStepId] = useState(null);
  const [newStepName, setNewStepName] = useState("");
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [editingIngredientIndex, setEditingIngredientIndex] = useState(null);
  const [editingIngredientValue, setEditingIngredientValue] = useState("");
  const [editingIngredientUnit, setEditingIngredientUnit] = useState("grams");
  const [editingIngredientName, setEditingIngredientName] = useState("");
  const [isAddingIngredient, setIsAddingIngredient] = useState(false);
  const alternatives = [
    { alt1: "Spaghetti", alt2: "Bucatini" },
    { alt1: "Guanciale", alt2: "Pancetta" },
    { alt1: "Egg yolk", alt2: "Egg yolk" },
    { alt1: "Pecorino cheese", alt2: "Parmigiano cheese" },
  ];

  // State to manage changes in ingredients
  const [changedIngredients, setChangedIngredients] = useState([]);

  // State to manage ingredient deletions
  const [deletedIngredients, setDeletedIngredients] = useState([]);

  // State to manage changes in steps
  const [changedSteps, setChangedSteps] = useState([]);

  const stepsListRef = useRef(null);
  const ingredientsListRef = useRef(null);

  const handleEdit = (step, index) => {
    setEditingStepId(step.id);
    setNewStepName(step.name);
    setIsAddingStep(false);
  };

  const handleConfirmEdit = () => {
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      steps: prevRecipe.steps.map((step) =>
        step.id === editingStepId ? { ...step, name: newStepName } : step,
      ),
    }));

    if (!changedSteps.find((s) => s.id === editingStepId)) {
      setChangedSteps((prev) => [
        ...prev,
        {
          id: editingStepId,
          name: newStepName,
        },
      ]);
    } else {
      setChangedSteps((prev) =>
        prev.map((s) =>
          editingStepId
            ? {
                id: s.id,
                name: newStepName,
              }
            : s,
        ),
      );
    }

    setEditingStepId(null);
  };

  const handleCancelEdit = () => {
    setEditingStepId(null);
    setNewStepName("");
  };

  {
    /* Logic to add step */
  }
  const handleAddStep = () => {
    setIsAddingStep(true);
    setNewStepName("");
    setEditingStepId(null);
  };

  useEffect(() => {
    if (stepsListRef.current) {
      stepsListRef.current.scrollTo({
        top: stepsListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [isAddingStep]);

  useEffect(() => {
    if (ingredientsListRef.current) {
      ingredientsListRef.current.scrollTo({
        top: ingredientsListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [isAddingIngredient]);

  const handleConfirmAddStep = () => {
    const newStep = {
      id: Date.now(), // Usa un ID unico
      name: newStepName,
    };

    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      steps: [...prevRecipe.steps, newStep],
    }));

    if (!changedSteps.find((s) => s.id === editingStepId)) {
      setChangedSteps((prev) => [
        ...prev,
        {
          id: editingStepId,
          name: newStepName,
          description: "",
          image: "",
          estimatedTime: 10,
          stepNumber: recipe.steps.length + 1,
          precedence: recipe.steps.length,
        },
      ]);
    } else {
      setChangedSteps((prev) =>
        prev.map((s) =>
          editingStepId
            ? {
                id: s.id,
                name: newStepName,
                description: "",
                image: "",
                estimatedTime: 10,
                stepNumber: recipe.steps.length + 1,
                precedence: recipe.steps.length,
              }
            : s,
        ),
      );
    }
    setIsAddingStep(false);
    setNewStepName("");
  };

  const handleCancelAddStep = () => {
    setIsAddingStep(false);
    setNewStepName("");
  };

  {
    /* Logic to add ingredients */
  }
  const handleAddIngredient = () => {
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      ingredients: [
        ...prevRecipe.ingredients,
        {
          value: "",
          unit: "grams",
          name: "",
          isNew: true, // Flag to identify new ingredients
        },
      ],
    }));
    setIsAddingIngredient(true);
    setEditingIngredientIndex(recipe.ingredients.length); // Set the index of the new ingredient
  };

  const handleEditIngredient = (index, ingredient) => {
    if (isAddingIngredient) {
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        ingredients: prevRecipe.ingredients.slice(0, -1),
      }));
      setEditingIngredientIndex(null);
      setEditingIngredientValue(null);
      setEditingIngredientUnit(null);
      setEditingIngredientName(null);
      setIsAddingIngredient(false);
    }
    setEditingIngredientIndex(index);
    setEditingIngredientValue(ingredient.value);
    setEditingIngredientUnit(ingredient.unit);
    setEditingIngredientName(ingredient.name);
  };

  const handleConfirmEditIngredient = () => {
    if (editingIngredientIndex !== null) {
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        ingredients: prevRecipe.ingredients.map((ingredient, i) =>
          i === editingIngredientIndex
            ? {
                ...ingredient,
                value: editingIngredientValue,
                unit: editingIngredientUnit,
                name: editingIngredientName,
              }
            : ingredient,
        ),
      }));
      setIsAddingIngredient(false);
      setEditingIngredientIndex(null);
      setEditingIngredientValue("");
      setEditingIngredientUnit("grams");
      setEditingIngredientName("");

      const ingredientId = recipe.ingredients[editingIngredientIndex].id;
      if (!changedIngredients.find((i) => i.id === ingredientId)) {
        setChangedIngredients((prev) => [
          ...prev,
          {
            id: ingredientId,
            value: editingIngredientValue,
            unit: editingIngredientUnit,
            name: editingIngredientName,
          },
        ]);
      } else {
        setChangedIngredients((prev) =>
          prev.map((i) =>
            i.id === ingredientId
              ? {
                  ...i,
                  value: editingIngredientValue,
                  unit: editingIngredientUnit,
                  name: editingIngredientName,
                }
              : i,
          ),
        );
      }
    }
  };
  const handleCancelEditIngredient = () => {
    if (isAddingIngredient) {
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        ingredients: prevRecipe.ingredients.slice(0, -1),
      }));
    }
    // Reset dello stato
    setIsAddingIngredient(false);
    setEditingIngredientIndex(null);
    setEditingIngredientValue("");
    setEditingIngredientUnit("grams");
    setEditingIngredientName("");
  };

  {
    /* Logic to remove ingredient */
  }
  const handleRemoveIngredient = (index) => {
    setDeletedIngredients((prev) => [...prev, recipe.ingredients[index]]);
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      ingredients: prevRecipe.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleRefreshIngredient = (index) => {
    let newIngredientName = "";
    if (index < alternatives.length) {
      if (recipe.ingredients[index].name === alternatives[index].alt1) {
        newIngredientName = alternatives[index].alt2;
        setRecipe((prevRecipe) => ({
          ...prevRecipe,
          ingredients: prevRecipe.ingredients.map((ingredient, i) =>
            i === index
              ? {
                  ...ingredient,
                  name: newIngredientName,
                }
              : ingredient,
          ),
        }));
      } else {
        newIngredientName = alternatives[index].alt1;
        setRecipe((prevRecipe) => ({
          ...prevRecipe,
          ingredients: prevRecipe.ingredients.map((ingredient, i) =>
            i === index
              ? {
                  ...ingredient,
                  name: newIngredientName,
                }
              : ingredient,
          ),
        }));
      }
    }

    const ingredient = recipe.ingredients[index];

    if (!changedIngredients.find((i) => i.id === ingredient.id)) {
      setChangedIngredients((prev) => [
        ...prev,
        {
          ...ingredient,
          name: newIngredientName,
        },
      ]);
    } else {
      setChangedIngredients((prev) =>
        prev.map((i) =>
          i.id === ingredient.id ? { ...i, name: newIngredientName } : i,
        ),
      );
    }
  };

  useEffect(() => {
    const getRecipe = async () => {
      const recipe = await API.getRecipe(props.recipe.id);
      setRecipe(recipe);
    };
    getRecipe();
  }, []);

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

  async function saveRecipe() {
    props.setIsOpenNewEditRecipe(false);
    changedSteps.forEach(async (step) => {
      if (step.id) await API.updateStep(props.recipe.id, step);
      else await API.createStep(props.recipe.id, step);
    });
    changedIngredients.forEach(async (ingredient) => {
      if (ingredient.id)
        await API.updateIngredient(props.recipe.id, ingredient);
      else await API.createIngredient(props.recipe.id, ingredient);
    });
    deletedIngredients.forEach(async (ingredient) => {
      await API.deleteIngredient(props.recipe.id, ingredient.id);
    });

    if (recipe.id === 4)
      // carbonara
      await API.setCreatedTrue(4);
  }

  return (
    <div className="popup-edit-recipe">
      <div className="popup-title">
        <div className="recipe-title">
          <h2>
            {props.recipeMode === "edit" ? "Edit " : ""}
            {props.recipe.name}:{" "}
            <span className="recipe-portions" onClick={() => {}}>
              {props.recipe.num_people} portion
            </span>
          </h2>
        </div>

        {/* X - Close button */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#000000"
          onClick={() => {
            props.setIsOpenNewEditRecipe(false);
          }}
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </div>

      <div className="recipe-container">
        {/* Steps list */}
        <div className="recipe-steps">
          <h4>Steps</h4>
          <ul className="steps-list" ref={stepsListRef}>
            {recipe &&
              recipe.steps.map((step, index) => (
                <li key={index} className="step-item">
                  {editingStepId === step.id ? (
                    <>
                      {/* Editing mode */}
                      <div className="step-number">Step {index + 1}:</div>
                      <div className="step-title">
                        <input
                          type="text"
                          value={newStepName}
                          onChange={(e) => setNewStepName(e.target.value)}
                          className="edit-input"
                        />
                      </div>
                      <div className="step-actions">
                        <span
                          className="icon confirm-icon"
                          onClick={handleConfirmEdit}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span
                          className="icon cancel-icon"
                          onClick={handleCancelEdit}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Normal mode */}
                      <div className="step-number">Step {index + 1}:</div>
                      <div className="step-title">{step.name}</div>
                      <div className="step-actions">
                        <span
                          className="icon edit-icon"
                          onClick={() => handleEdit(step, index)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </span>
                      </div>
                    </>
                  )}
                </li>
              ))}
            {/* Input per il nuovo step */}
            {isAddingStep && (
              <li className="step-item">
                <div className="step-number">
                  Step {recipe ? recipe.steps.length + 1 : 1}:
                </div>
                <div className="step-title">
                  <input
                    type="text"
                    value={newStepName}
                    onChange={(e) => setNewStepName(e.target.value)}
                    className="edit-input"
                  />
                </div>
                <div className="step-actions">
                  <span
                    className="icon confirm-icon"
                    onClick={handleConfirmAddStep}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span
                    className="icon cancel-icon"
                    onClick={handleCancelAddStep}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </div>
              </li>
            )}
          </ul>
          {!isAddingStep && (
            <button className="add-step-btn" onClick={handleAddStep}>
              Add step
            </button>
          )}
        </div>

        <div className="vertical-line"></div>

        {/* Ingredients list */}
        <div className="recipe-ingredients">
          <h4>Ingredients</h4>
          <ul className="ingredients-list" ref={ingredientsListRef}>
            {recipe &&
              recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="ingredient-item">
                  {editingIngredientIndex === index ||
                  (isAddingIngredient && editingIngredientIndex === index) ? (
                    // Modalità di modifica o aggiunta
                    <div className="ingredient-details">
                      <input
                        type="number"
                        value={editingIngredientValue}
                        onChange={(e) =>
                          setEditingIngredientValue(e.target.value)
                        }
                        className="ingredient-quantity-input"
                      />
                      <select
                        value={editingIngredientUnit}
                        onChange={(e) =>
                          setEditingIngredientUnit(e.target.value)
                        }
                        className="ingredient-unit-input"
                      >
                        <option value="grams" defaultValue={true}>
                          grams
                        </option>
                        <option value="kilograms">kilograms</option>
                        <option value="milliliters">milliliters</option>
                        <option value="liters">liters</option>
                        <option value="q.s.">q.s.</option>
                      </select>
                      <input
                        type="text"
                        value={editingIngredientName}
                        onChange={(e) => {
                          setEditingIngredientName(e.target.value);
                        }}
                        className="ingredient-name-input"
                      />
                    </div>
                  ) : (
                    // Modalità normale
                    <div className="ingredient-details">
                      <span className="ingredient-quantity">
                        {ingredient.value}
                      </span>
                      <span className="ingredient-unit">
                        {convertToUnitSymbol(ingredient.unit)}
                      </span>
                      <span className="ingredient-name">{ingredient.name}</span>
                    </div>
                  )}
                  <div className="ingredient-actions">
                    {ingredient.unit.toLowerCase() === "q.s." ? (
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveIngredient(index)}
                      >
                        Remove
                      </button>
                    ) : editingIngredientIndex === index ||
                      (isAddingIngredient &&
                        editingIngredientIndex === index) ? (
                      <>
                        <span
                          className="icon confirm-icon"
                          onClick={handleConfirmEditIngredient}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span
                          className="icon cancel-icon"
                          onClick={handleCancelEditIngredient}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </span>
                      </>
                    ) : (
                      <>
                        <span
                          className="icon refresh-icon"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onClick={() => handleRefreshIngredient(index)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="20"
                            height="16"
                            viewBox="0,0,300,250"
                          >
                            <g transform="">
                              <g
                                fill="currentColor"
                                fillRule="nonzero"
                                stroke="none"
                                strokeWidth="1"
                                strokeLinecap="butt"
                                strokeLinejoin="none"
                                strokeMiterlimit="10"
                                strokeDasharray=""
                                strokeDashoffset="0"
                                fontFamily="none"
                                fontWeight="none"
                                fontSize="none"
                                textAnchor="none"
                              >
                                <path
                                  transform="scale(8.53333,8.53333)"
                                  d="M26.94922,14h3.05078l-4,6l-4,-6h2.95117c-0.50018,-5.06207 -4.75461,-9 -9.95117,-9c-2.4834,0 -4.74593,0.90009 -6.49414,2.39453c-0.26947,0.24712 -0.65232,0.32748 -0.99842,0.20959c-0.3461,-0.1179 -0.60027,-0.41526 -0.66286,-0.77549c-0.06258,-0.36023 0.0764,-0.7259 0.36245,-0.95363c2.09579,-1.79156 4.82437,-2.875 7.79297,-2.875c6.27784,0 11.43793,4.85166 11.94922,11zM8,16h-2.95117c0.50018,5.06207 4.75461,9 9.95117,9c2.4834,0 4.74593,-0.90009 6.49414,-2.39453c0.26947,-0.24712 0.65232,-0.32749 0.99842,-0.20959c0.3461,0.1179 0.60028,0.41526 0.66286,0.7755c0.06258,0.36023 -0.0764,0.7259 -0.36245,0.95363c-2.09579,1.79156 -4.82437,2.875 -7.79297,2.875c-6.27784,0 -11.43792,-4.85166 -11.94922,-11h-3.05078l4,-6z"
                                  id="strokeMainSVG"
                                  stroke="currentColor"
                                  strokeLinejoin="round"
                                ></path>
                                <g
                                  transform="scale(8.53333,8.53333)"
                                  stroke="none"
                                  strokeLinejoin="miter"
                                >
                                  <path d="M15,3c-2.9686,0 -5.69718,1.08344 -7.79297,2.875c-0.28605,0.22772 -0.42503,0.59339 -0.36245,0.95363c0.06258,0.36023 0.31676,0.6576 0.66286,0.77549c0.3461,0.1179 0.72895,0.03753 0.99842,-0.20959c1.74821,-1.49444 4.01074,-2.39453 6.49414,-2.39453c5.19656,0 9.45099,3.93793 9.95117,9h-2.95117l4,6l4,-6h-3.05078c-0.51129,-6.14834 -5.67138,-11 -11.94922,-11zM4,10l-4,6h3.05078c0.51129,6.14834 5.67138,11 11.94922,11c2.9686,0 5.69718,-1.08344 7.79297,-2.875c0.28605,-0.22772 0.42504,-0.59339 0.36245,-0.95363c-0.06258,-0.36023 -0.31676,-0.6576 -0.66286,-0.7755c-0.3461,-0.1179 -0.72895,-0.03753 -0.99842,0.20959c-1.74821,1.49444 -4.01074,2.39453 -6.49414,2.39453c-5.19656,0 -9.45099,-3.93793 -9.95117,-9h2.95117z"></path>
                                </g>
                              </g>
                              <g
                                fill="currentColor"
                                fillRule="nonzero"
                                stroke="none"
                                strokeWidth="none"
                                strokeLinecap="butt"
                                strokeLinejoin="none"
                                strokeMiterlimit="10"
                                strokeDasharray=""
                                strokeDashoffset="0"
                                fontFamily="none"
                                fontWeight="none"
                                fontSize="none"
                                textAnchor="none"
                              >
                                <path
                                  d="M137.565,164.4l-6.95,-19h-30.5l-6.85,19h-9.9l27.8,-72.8h8.4l27.85,72.8zM115.365,103.45l-12.35,34.05h24.75zM167.515,91.6v72.8h-9.6v-72.8z"
                                  id="strokeMainSVG"
                                  stroke="currentColor"
                                  strokeWidth="8.53333"
                                  strokeLinejoin="round"
                                ></path>
                                <g
                                  stroke="none"
                                  strokeWidth="1"
                                  strokeLinejoin="miter"
                                >
                                  <path d="M137.565,164.4l-6.95,-19h-30.5l-6.85,19h-9.9l27.8,-72.8h8.4l27.85,72.8zM115.365,103.45l-12.35,34.05h24.75zM167.515,91.6v72.8h-9.6v-72.8z"></path>
                                </g>
                              </g>
                            </g>
                          </svg>
                        </span>
                        <span
                          className="icon edit-icon"
                          onClick={() =>
                            handleEditIngredient(index, ingredient)
                          }
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </span>
                        <span
                          className="icon remove-icon"
                          onClick={() => handleRemoveIngredient(index)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </span>
                      </>
                    )}
                  </div>
                </li>
              ))}
          </ul>
          {!isAddingIngredient && (
            <button
              className="add-ingredient-btn"
              onClick={handleAddIngredient}
            >
              Add ingredient
            </button>
          )}
        </div>
      </div>

      <div className="button-container-recipe">
        {/* Discard changes button */}
        <button
          className="discard-btn"
          onClick={() => {
            setIsOpenDiscardChanges(true);
          }}
        >
          Discard {props.recipeMode === "edit" ? "changes" : "recipe"}
        </button>

        {/* Save for later button */}
        <button
          className="save-later-btn"
          onClick={async () => {
            await saveRecipe();
            await props.fetchRecipes();
          }}
        >
          Save for later
        </button>

        {/* Save & cook button */}
        <button
          className="save-cook-btn"
          onClick={async () => {
            await saveRecipe();
            props.setNumPortions();
            props.setSelectedRecipe();
            navigate("/cooking");
          }}
        >
          Save & cook
        </button>
      </div>
      {/* Discard changes modal */}
      <Modal
        isOpen={isOpenDiscardChanges}
        onRequestClose={() => {
          setIsOpenDiscardChanges(false);
        }}
        contentLabel="discardChanges"
        className="modal"
      >
        <DiscardChanges
          setIsOpenNewEditRecipe={props.setIsOpenNewEditRecipe}
          setIsOpenDiscardChanges={setIsOpenDiscardChanges}
          recipeMode={props.recipeMode}
        />
      </Modal>
    </div>
  );
}

export default CreateEditRecipe;
