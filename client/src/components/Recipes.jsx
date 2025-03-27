/* eslint-disable react/prop-types */
import { Header, HomeButton } from "./Navigation";
import { useNavigate } from "react-router-dom";
import "../styles/Recipes.scss";
import { useState } from "react";
import Modal from "react-modal";
import SetMaxDuration from "./SetMaxDuration";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faClock,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import CreateEditRecipe from "./CreateEditRecipe";
import NewRecipe from "./NewRecipe";
import DeleteRecipe from "./DeleteRecipe";
import API from "../API";

Modal.setAppElement("#root");

function Recipes(props) {
  const nav = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);
  const [query, setQuery] = useState("");
  const [maxDuration, setMaxDuration] = useState("");
  const [order, setOrder] = useState("");
  const [isOpenMaxDuration, setIsOpenMaxDuration] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [isOpenNewEditRecipe, setIsOpenNewEditRecipe] = useState(false);
  const [recipeMode, setRecipeMode] = useState("");
  const [isOpenNewRecipe, setIsOpenNewRecipe] = useState(false);
  const [isOpenDeleteRecipe, setIsOpenDeleteRecipe] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [portions, setPortions] = useState(1);

  const fetchRecipes = async () => {
    const recipes = await API.getAllRecipes();
    setRecipes(recipes);
    setFilteredRecipes(recipes);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    let newFilteredRecipes = recipes.filter((recipe) =>
      recipe.name.includes(query),
    );

    if (maxDuration) {
      newFilteredRecipes = newFilteredRecipes.filter(
        (recipe) => recipe.estimated_time <= maxDuration,
      );
    }

    setFilteredRecipes(
      newFilteredRecipes.sort((a, b) => {
        if (order === "shortest") {
          return a.estimated_time - b.estimated_time;
        } else if (order === "longest") {
          return b.estimated_time - a.estimated_time;
        } else {
          return new Date(b.date) - new Date(a.date);
        }
      }),
    );
  }, [query, maxDuration, order]);

  // Gestisci lo scroll del body quando il modal è aperto
  useEffect(() => {
    if (
      isOpenMaxDuration ||
      isOpenNewRecipe ||
      isOpenNewEditRecipe ||
      isOpenDeleteRecipe
    ) {
      document.body.style.overflow = "hidden"; // Disabilita lo scroll
    } else {
      document.body.style.overflow = ""; // Ripristina lo scroll
    }
  }, [
    isOpenMaxDuration,
    isOpenNewRecipe,
    isOpenNewEditRecipe,
    isOpenDeleteRecipe,
  ]);

  const handleSelect = (id) => {
    setSelectedRecipeId(id);
    setSelectedRecipe(recipes.find((recipe) => recipe.id === id));
  };

  const deleteSelectedRecipe = async () => {
    await API.deleteRecipe(selectedRecipe.id);
    setSelectedRecipe(null);
    await fetchRecipes();
  };

  return (
    <div className="recipes-page">
      <div className="blurry-background"></div>
      <Header title={"Cooking time!"} />
      <HomeButton />

      <div className="recipes-content">
        <div className="recipes-container-top">
          <h2 className="recipes-title">Previous recipes:</h2>
          <div className="recipes-filters">
            {/* Search bar to filter recipes */}
            <div id="search-input-container">
              <img src="magnifying-glass.png" className="search-icon-mg" />
              <input
                type="text"
                className="search-input"
                placeholder="Search for a recipe"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {/* Max duration filtering */}
            <div
              className="max-duration"
              onClick={() => {
                setIsOpenMaxDuration(true);
              }}
            >
              <span className="max-d-left">{"Max duration: "}</span>
              <span className="max-d-rigth">
                {maxDuration ? maxDuration + " min" : "Any"}
              </span>
            </div>

            {/* Order filtering */}
            <div className="order-container">
              <label htmlFor="order">Order:</label>
              <select
                id="order"
                defaultValue={order || "most-recent"}
                onChange={(e) => {
                  setOrder(e.target.value);
                }}
              >
                <option value="most-recent">Newest</option>
                <option value="shortest">Shortest</option>
                <option value="longest">Longest</option>
              </select>
            </div>
          </div>
        </div>
        <div className="recipes-container-bottom">
          <div className="recipes-list">
            {filteredRecipes
              .filter((recipe) => recipe.created != 0)
              .map((recipe) => (
                <div
                  className={`recipe ${selectedRecipeId === recipe.id ? "selected" : ""}`}
                  key={recipe.id}
                  onClick={() => handleSelect(recipe.id)}
                >
                  {/* Aggiunta immagine esterna */}
                  <div className="recipe-image">
                    <img
                      src={recipe.image}
                      alt={`${recipe.name} image`}
                      style={{
                        width: "100%",
                        height: "auto",
                      }}
                    />
                  </div>
                  <div className="recipe-info">
                    <h3>{recipe.name}</h3>
                  </div>
                  <div className="recipe-time">
                    <FontAwesomeIcon icon={faClock} className="timer-icon" />
                    <span>{recipe.estimated_time} mins</span>
                  </div>
                  {selectedRecipeId === recipe.id && (
                    <div className="overlay-icons">
                      <span
                        onClick={() => {
                          setIsOpenNewEditRecipe(true);
                          setRecipeMode("edit");
                        }}
                      >
                        <div>
                          <FontAwesomeIcon icon={faEdit} className="icon" />
                        </div>
                      </span>
                      <span
                        onClick={() => {
                          setIsOpenDeleteRecipe(true);
                        }}
                      >
                        <div>
                          <FontAwesomeIcon icon={faTrash} className="icon" />
                        </div>
                      </span>
                    </div>
                  )}
                </div>
              ))}
          </div>
          <div className="vertical-line"></div>
          <div
            className="new-recipe-container"
            onClick={() => {
              setSelectedRecipe(
                filteredRecipes.filter((recipe) => recipe.created == 0)[0],
              );
              setSelectedRecipeId(4);
              setIsOpenNewRecipe(true);
            }}
          >
            <div className="plus-rectangle">
              {" "}
              <span className="icon plus-icon">
                <FontAwesomeIcon icon={faPlus} />
              </span>
            </div>
            <h3>New recipe</h3>
          </div>
        </div>
        <div className="button-container-recipes">
          <div className="portions-input" style={{ fontSize: "18px" }}>
            <label htmlFor="portions" style={{ marginRight: "10px" }}>
              Portions:
            </label>
            <span
              onClick={() => {
                if (portions > 1) setPortions((portions) => portions - 1);
              }}
              style={{ marginRight: "10px" }}
            >
              <FontAwesomeIcon icon={faMinus} />
            </span>
            {portions}
            <span
              onClick={() => setPortions((portions) => portions + 1)}
              style={{ marginLeft: "10px" }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </span>
          </div>
          <button
            className="start-btn"
            disabled={selectedRecipe == null}
            onClick={() => {
              props.setNumPortions(portions);
              props.setSelectedRecipe(selectedRecipe.id);
              nav("/cooking");
            }}
          >
            Start
          </button>
        </div>

        {/* Max duration modal */}
        <Modal
          isOpen={isOpenMaxDuration}
          onRequestClose={() => {
            //setIsOpenMaxDuration(false);
          }}
          contentLabel="setMaxDuration"
          className="modal"
        >
          <SetMaxDuration
            maxDuration={maxDuration ? maxDuration : 65}
            setMaxDuration={setMaxDuration}
            setIsOpenMaxDuration={setIsOpenMaxDuration}
          />
        </Modal>

        {/* NewEdit recipe modal */}
        <Modal
          isOpen={isOpenNewEditRecipe}
          onRequestClose={() => {
            //setIsOpenNewEditRecipe(false);
          }}
          contentLabel="CreateEditRecipe"
          className="modal"
        >
          <CreateEditRecipe
            recipe={selectedRecipe}
            setIsOpenNewEditRecipe={setIsOpenNewEditRecipe}
            recipeMode={recipeMode}
            fetchRecipes={fetchRecipes}
            setNumPortions={() => props.setNumPortions(portions)}
            setSelectedRecipe={() => props.setSelectedRecipe(selectedRecipe.id)}
          />
        </Modal>

        {/* New recipe modal */}
        <Modal
          isOpen={isOpenNewRecipe}
          onRequestClose={() => {
            //setIsOpenNewRecipe(false);
          }}
          contentLabel="NewRecipe"
          className="modal"
        >
          <NewRecipe
            setIsOpenNewRecipe={setIsOpenNewRecipe}
            setIsOpenNewEditRecipe={setIsOpenNewEditRecipe}
            setRecipeMode={setRecipeMode}
          />
        </Modal>

        {/* Delete recipe modal */}
        <Modal
          isOpen={isOpenDeleteRecipe}
          onRequestClose={() => {
            //setIsOpenDeleteRecipe(false);
          }}
          contentLabel="DeleteRecipe"
          className="modal"
        >
          <DeleteRecipe
            recipe={selectedRecipe}
            deleteSelectedRecipe={deleteSelectedRecipe}
            setIsOpenDeleteRecipe={setIsOpenDeleteRecipe}
          />
        </Modal>
      </div>
    </div>
  );
}

export default Recipes;
