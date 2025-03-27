/* eslint-disable react/prop-types */
import { use } from "react";
import "../styles/Timer.scss";
import { useState, useEffect, useRef } from "react";

const format_time = (seconds) => {
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

function TimerPopup(props) {
  return (
    <div className="timer-popup">
      <div className="popup-title">
        <h2>{`Timer - ${props.step_description}`}</h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#000000"
          onClick={() => props.setOpenTimer(false)}
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </div>
      <TimerSelector
        time={props.time}
        setTime={props.timer_setTime}
        scroll={props.paused || !props.active}
      />
      <div className="timer-buttons">
        {!props.active ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="48px"
            viewBox="0 -960 960 960"
            width="48px"
            fill="#000000"
            onClick={() => {
              props.timer_setActive(true);
              props.timer_setPaused(false);
            }}
          >
            <path d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
          </svg>
        ) : !props.paused ? (
          <>
            {props.time !== 0 && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48px"
                viewBox="0 -960 960 960"
                width="48px"
                fill="#000000"
                onClick={() => {
                  props.timer_setPaused(true);
                }}
              >
                <path d="M360-320h80v-320h-80v320Zm160 0h80v-320h-80v320ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
              </svg>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48px"
              viewBox="0 -960 960 960"
              width="48px"
              fill="#000000"
              onClick={() => {
                props.timer_setTime(props.defaultTime);
                props.timer_setActive(false);
                props.timer_setPaused(false);
              }}
            >
              <path d="M320-320h320v-320H320v320ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
            </svg>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48px"
              viewBox="0 -960 960 960"
              width="48px"
              fill="#000000"
              onClick={() => {
                props.timer_setActive(true);
                props.timer_setPaused(false);
              }}
            >
              <path d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48px"
              viewBox="0 -960 960 960"
              width="48px"
              fill="#000000"
              onClick={() => {
                props.timer_setTime(props.defaultTime);
                props.timer_setActive(false);
                props.timer_setPaused(false);
              }}
            >
              <path d="M320-320h320v-320H320v320ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
            </svg>
          </>
        )}
      </div>
    </div>
  );
}

function Timer(props) {
  const audioRef = useRef(new Audio("./alarm_clock.mp3"));

  // Initialize audio settings only once
  if (!audioRef.current.initialized) {
    audioRef.current.volume = 0.5; // Set volume to 50%
    audioRef.current.loop = true;
    audioRef.current.initialized = true; // Mark audio as initialized
  }

  const timeOut = () => {
    audioRef.current.play();
  };

  const manageTimer = () => {
    if (props.active && props.time === 0) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      props.setActive(false);
      props.setTime(props.defaultTime);
    } else if (props.active) {
      props.setOpenTimer(true);
    } else {
      props.setOpenTimer(true);
    }
  };

  useEffect(() => {
    if (!props.active || props.paused) {
      return;
    }
    const t = setTimeout(() => {
      props.setTime((prevTime) => {
        if (prevTime > 1) {
          return prevTime - 1;
        } else {
          clearTimeout(t);
          return 0;
        }
      });
    }, 1000);

    return () => clearTimeout(t);
  }, [props.time, props.active, props.paused]);

  useEffect(() => {
    if (props.time === 0 && props.active) {
      timeOut();
    }
  }, [props.time]);

  useEffect(() => {
    if (props.paused || (!props.active && !props.paused)) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [props.paused, props.active]);

  return (
    <div
      className={props.active ? "timer-box active" : "timer-box"}
      onClick={() => manageTimer()}
    >
      {(props.active || props.paused) && (
        <>
          {props.time != 0 && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#ffffff"
            >
              <path d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z" />
            </svg>
          )}
          {props.time == 0 && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#ffffff"
              className="shake"
            >
              <path d="m438-298 226-226-57-57-169 169-85-85-57 57 142 142Zm42 218q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-800q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Zm0-360ZM224-866l56 56-170 170-56-56 170-170Zm512 0 170 170-56 56-170-170 56-56ZM480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720q-117 0-198.5 81.5T200-440q0 117 81.5 198.5T480-160Z" />
            </svg>
          )}
          {props.time != 0 ? (
            <span style={{ color: "white" }}>{format_time(props.time)}</span>
          ) : (
            <span className="shake" style={{ color: "white" }}>
              {format_time(props.time)}
            </span>
          )}
        </>
      )}
      {!props.active && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#ffffff"
        >
          <path d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z" />
        </svg>
      )}
    </div>
  );
}

function TimerSelector(props) {
  const [minutes, setMinutes] = useState(Math.floor(props.time / 60) || 0);
  const [seconds, setSeconds] = useState(props.time % 60 || 0);

  const generateOptions = (maxValue) => {
    return [-1, ...Array.from({ length: maxValue + 1 }, (_, i) => i), -2];
  };

  const handleScroll = (e, setter, maxValue) => {
    if (!props.scroll) {
      e.preventDefault(); // Stop scrolling while locked
      e.stopPropagation();
    }
    const itemHeight = 40; // Height of a single option
    const selectedIndex = Math.round(e.target.scrollTop / itemHeight); // Use rounding for exact match
    setter(Math.min(maxValue, Math.max(0, selectedIndex))); // Ensure value is within valid range
  };

  const scrollToValue = (ref, value) => {
    if (ref?.current) {
      const itemHeight = 40; // Height of each option
      ref.current.scrollTop = value * itemHeight;
    }
  };

  useEffect(() => {
    const preventScroll = (e) => {
      if (!props.scroll) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (minutesRef.current && secondsRef.current) {
      const optionsRefs = [minutesRef.current, secondsRef.current];
      optionsRefs.forEach((ref) => {
        if (!props.scroll) {
          ref.addEventListener("wheel", preventScroll, { passive: false });
          ref.addEventListener("touchmove", preventScroll, { passive: false });
        } else {
          ref.removeEventListener("wheel", preventScroll);
          ref.removeEventListener("touchmove", preventScroll);
        }
      });

      return () => {
        // Clean up the event listeners
        optionsRefs.forEach((ref) => {
          ref.removeEventListener("wheel", preventScroll);
          ref.removeEventListener("touchmove", preventScroll);
        });
      };
    }
  }, [props.scroll]);

  const minutesRef = useRef(null);
  const secondsRef = useRef(null);

  useEffect(() => {
    // Scroll to the correct positions based on initialMinutes and initialSeconds
    scrollToValue(minutesRef, Math.floor(props.time / 60));
    scrollToValue(secondsRef, props.time % 60);
  }, [props.time]);

  useEffect(() => {
    props.setTime(minutes * 60 + seconds);
  }, [minutes, seconds]);

  return (
    <div className="timer-selector">
      <div className="timer-column">
        <div
          className="options"
          ref={minutesRef}
          onScroll={(e) => handleScroll(e, setMinutes, 59)}
        >
          {generateOptions(59).map((value) =>
            value < 0 ? (
              <div key={`empty-${value}`} className="empty-option" />
            ) : (
              <div
                key={value}
                className={`option ${
                  props.scroll
                    ? value === minutes
                      ? "selected"
                      : ""
                    : value === minutes
                      ? "selected"
                      : "empty-option"
                }`}
              >
                {props.scroll || value === minutes
                  ? value.toString().padStart(2, "0")
                  : ""}
              </div>
            ),
          )}
        </div>
        <span className="label">Minutes</span>
      </div>

      <div className="timer-column">
        <div
          className="options"
          ref={secondsRef}
          onScroll={(e) => handleScroll(e, setSeconds, 59)}
        >
          {generateOptions(59).map((value) =>
            value < 0 ? (
              <div key={`empty-${value}`} className="empty-option" />
            ) : (
              <div
                key={value}
                className={`option ${
                  props.scroll
                    ? value === seconds
                      ? "selected"
                      : ""
                    : value === seconds
                      ? "selected"
                      : "empty-option"
                }`}
              >
                {props.scroll || value === seconds
                  ? value.toString().padStart(2, "0")
                  : ""}
              </div>
            ),
          )}
        </div>
        <span className="label">Seconds</span>
      </div>
    </div>
  );
}

export { Timer, TimerPopup, TimerSelector };
