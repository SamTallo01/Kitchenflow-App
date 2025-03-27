import { useNavigate } from "react-router-dom";
import "../styles/LeaveCooking.scss";

function LeaveCooking(props) {
  const nav = useNavigate();
  return (
    <div className="popup-leave">
      <div className="popup-title">
        <h2 className="leave-title">Leaving recipe</h2>
        {/* X - Close button */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#000000"
          onClick={() => {
            props.setOpenLeaveCooking(false);
          }}
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </div>

      <p className="text">You are leaving the recipe. Are you sure?</p>
      <div className="button-container-leave">
        <button
          className="cancel-btn"
          onClick={() => {
            props.setOpenLeaveCooking(false);
          }}
        >
          Cancel
        </button>
        <button
          className="leave-btn"
          onClick={() => {
            props.setOpenLeaveCooking(false);
            nav("/");
          }}
        >
          Leave
        </button>
      </div>
    </div>
  );
}

export default LeaveCooking;
