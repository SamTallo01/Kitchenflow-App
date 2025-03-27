/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import "../styles/SetMaxDuration.scss";
import "../styles/Timer.scss";

function SetMaxDuration(props) {
  const [selected, setSelected] = useState(props.maxDuration || 65);
  const [minutes, setMinutes] = useState(selected);

  return (
    <div className="popup-duration">
      <div className="popup-title">
        <h2>Set Max Duration</h2>

        {/* X - Close button */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#000000"
          onClick={() => props.setIsOpenMaxDuration(false)}
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </div>

      <TimerSelector time={selected} setMinutes={setMinutes}></TimerSelector>

      <div className="button-container-duration">
        <button
          className="set-duration-btn"
          onClick={() => {
            props.setMaxDuration(minutes);
            props.setIsOpenMaxDuration(false);
          }}
        >
          Set
        </button>
      </div>
    </div>
  );
}

function TimerSelector(props) {
  const [minutes, setMinutes] = useState(props.time);

  const generateOptions = (maxValue) => {
    return [
      -1,
      ...Array.from({ length: (maxValue - 10) / 5 + 2 }, (_, i) => 10 + i * 5),
      -2,
    ];
  };

  const handleScroll = (e, setter, maxValue) => {
    const itemHeight = 40; // Height of a single option
    const selectedIndex = Math.round(e.target.scrollTop / itemHeight); // Use rounding for exact match
    if (selectedIndex === 11) {
      setMinutes(null);
    } else {
      setter(Math.min(maxValue, Math.max(0, selectedIndex)) * 5 + 10); // Ensure value is within valid range
    }
  };

  const scrollToValue = (ref, value) => {
    if (ref?.current) {
      const itemHeight = 40; // Height of each option
      ref.current.scrollTop = (value / 5 - 2) * itemHeight;
    }
  };

  const minutesRef = useRef(null);

  useEffect(() => {
    // Scroll to the correct positions based on initialMinutes and initialSeconds
    scrollToValue(minutesRef, props.time);
  }, [props.time]);

  useEffect(() => {
    // set value in ancient component
    props.setMinutes(minutes);
  }, [minutes]);

  return (
    <div className="timer-selector">
      <div className="timer-column">
        <div
          className="options"
          ref={minutesRef}
          onScroll={(e) => handleScroll(e, setMinutes, 59)}
        >
          {generateOptions(55).map((value) =>
            value < 0 ? (
              <div key={`empty-${value}`} className="empty-option" />
            ) : (
              <>
                <div
                  key={value}
                  className={`option ${value === minutes ? "selected" : ""}`}
                >
                  {value.toString().padStart(2, "0")}
                </div>
                {/* "Any" selection after the last value */}
                {value == 60 ? (
                  <div
                    key={"Any"}
                    className={`option ${minutes === null ? "selected" : ""}`}
                  >
                    {"Any".toString().padStart(2, "0")}
                  </div>
                ) : null}
              </>
            ),
          )}
        </div>
        <span className="label">Minutes</span>
      </div>
    </div>
  );
}

export default SetMaxDuration;
