import { useNavigate } from "react-router-dom";
import "../styles/LeaveCooking.scss";
import API from "../API.js";

function FinishCooking(props) {
  const nav = useNavigate();
  return (
    <div className="popup-leave">
      <div className="popup-title">
        <h2 className="leave-title">Finish recipe</h2>
        {/* X - Close button */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#000000"
          onClick={async () => {
            props.setOpenFinishCooking(false);
          }}
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </div>

      <p className="text">You didn't finish all the steps, are you sure you want to leave?</p>
      <div className="button-container-leave">
        <button
          className="cancel-btn"
          onClick={() => {
            props.setOpenFinishCooking(false);
          }}
        >
          Cancel
        </button>
        <button
          className="leave-btn"
          onClick={async () => {
            if (props.recipe.id === 1){
              await API.updateRedeemable(3, 1);
            }
            props.setOpenFinishCooking(false);
            nav("/recap", { state: { recipe: props.recipe } });
          }}
        >
          Finish
        </button>
      </div>
    </div>
  );
}

export default FinishCooking;
