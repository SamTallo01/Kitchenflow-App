/* eslint-disable react/prop-types */
import "../styles/BadgePopup.scss";

function BadgePopup(props) {
  return (
    <div className="popup-badge">
      <div className="popup-badge-content">
        <div className="popup-title">
          <h2>{props.badge.name}</h2>
          {/* X - Close button */}
          <svg
            className="close-popup"
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
            onClick={() => props.closePopup()}
          >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </div>
        {props.badge.unlocked ? (
          <>
            <h3>Congratulations you have completed the following task:</h3>
            <p>{props.badge.description}</p>
          </>
        ) : (
          <>
            <h3>Hint on how to obtain this badge:</h3>
            <p>{props.badge.hint}</p>
          </>
        )}

        <button
          className="close-button-badge"
          onClick={() => props.closePopup()}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default BadgePopup;
