/* eslint-disable react/prop-types */
import "../styles/DiscardChanges.scss";

function DiscardChanges(props) {
  return (
    <div className="popup-discard">
      <div className="popup-title">
        <h2 className="discard-title">Discard {props.recipeMode === "edit" ? "changes" : "recipe"}</h2>
        {/* X - Close button */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#000000"
          onClick={() => {
            props.setIsOpenDiscardChanges(false);
          }}
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </div>

      <p className="text">Are you sure you want to discard {props.recipeMode === "edit" ? "all your changes" : "the recipe"}?</p>
      <div className="button-container-discard">
        <button
          className="keep-btn"
          onClick={() => {
            props.setIsOpenDiscardChanges(false);
          }}
        >
          Keep
        </button>
        <button
          className="discard-btn"
          onClick={() => {
            props.setIsOpenDiscardChanges(false);
            props.setIsOpenNewEditRecipe(false);
          }}
        >
          Discard
        </button>
      </div>
    </div>
  );
}

export default DiscardChanges;
