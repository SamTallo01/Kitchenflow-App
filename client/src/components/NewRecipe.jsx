/* eslint-disable react/prop-types */
import "../styles/NewRecipe.scss";
import Modal from "react-modal";
import SetMaxDuration from "./SetMaxDuration";
import { useState } from "react";

function NewRecipe(props) {
  const [maxDuration, setMaxDuration] = useState("");
  const [isOpenMaxDuration, setIsOpenMaxDuration] = useState(false);
  const [newRecipeName, setNewRecipeName] = useState("");

  return (
    <div className="popup-new-recipe">
      <div className="popup-title">
        <h3>Tell me what recipe you want to cook!</h3>
        {/* X - Close button */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#000000"
          className="x-svg"
          onClick={() => {
            props.setIsOpenNewRecipe(false);
          }}
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </div>

      <div className="popup-content-container">
        <input
          type="text"
          placeholder="Insert a recipe name"
          onChange={(e) => setNewRecipeName(e.target.value)}
        />

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
      </div>
      <div className="button-container-new-recipe">
        <button
          className="cancel-btn"
          onClick={() => {
            props.setIsOpenNewRecipe(false);
            props.setIsOpenNewEditRecipe(false);
          }}
        >
          Cancel
        </button>
        <button
          className="generate-btn"
          onClick={() => {
            props.setIsOpenNewRecipe(false);
            props.setIsOpenNewEditRecipe(true);
            props.setRecipeMode("create");
          }}
        >
          <span className="ai-text">AI</span>
          <span className="generate-text">Generate</span>
        </button>
      </div>
      {/* Max duration modal */}
      <Modal
        isOpen={isOpenMaxDuration}
        onRequestClose={() => {
          setIsOpenMaxDuration(false);
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
    </div>
  );
}

export default NewRecipe;
