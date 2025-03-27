/* eslint-disable react/prop-types */
import "../styles/DeleteRecipe.scss";

function DeleteRecipe(props) {
  return (
    <div className="popup-delete">
      <div className="popup-title">
        <h2 className="delete-title">Delete recipe</h2>
        {/* X - Close button */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#000000"
          onClick={() => {
            props.setIsOpenDeleteRecipe(false);
          }}
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </div>

      <p className="text">Are you sure you want to delete &quot;{props.recipe.name}&quot;?</p>
      <div className="button-container-delete">
        <button
          className="keep-btn"
          onClick={() => {
            props.setIsOpenDeleteRecipe(false);
          }}
        >
          Keep
        </button>
        <button
          className="delete-btn"
          onClick={() => {
            // Delete recipe
            props.deleteSelectedRecipe();
            props.setIsOpenDeleteRecipe(false);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default DeleteRecipe;
