import { Timer } from "./TimerComponents";

function Step(props) {
  return (
    <div className="step-timer-wrapper">
      <div
        className={props.active ? "step-box active" : "step-box"}
        onClick={() => props.setStep()}
      >
        {(props.active || props.completed) && (
          <input
            type="checkbox"
            className="custom-checkbox"
            checked={props.completed}
            onClick={() => {
              props.setCompleted(!props.completed);
            }}
          />
        )}
        <h3>{props.name}</h3>
      </div>

      {(props.active || props.timer_active) && (
        <Timer
          active={props.timer_active}
          time={props.timer_time}
          paused={props.timer_paused}
          setActive={props.timer_setActive}
          setTime={props.timer_setTime}
          setPaused={props.timer_setPaused}
          defaultTime={props.defaultTime}
          setOpenTimer={(value) =>
            props.setOpenTimers((prev) => {
              return prev.map((v, i) => {
                if (i === props.step) {
                  return value;
                }
                return v;
              });
            })
          }
        />
      )}
    </div>
  );
}

function Steps(props) {
  return (
    <div className="steps-box">
      {props.steps_description.map((step, index) => (
        <Step
          key={index}
          name={step}
          step={index}
          active={props.step == index}
          setStep={() => props.setStep(index)}
          timer_active={props.timers[index][0]}
          timer_time={props.timers[index][2]}
          timer_paused={props.timers[index][1]}
          defaultTime={props.defaultTimes[index]}
          timer_setActive={(active) => {
            props.setTimers((prevTimers) => {
              return prevTimers.map((timer, i) => {
                if (i === index) {
                  return [active, timer[1], timer[2]];
                }
                return timer;
              });
            });
          }}
          timer_setTime={(time) => {
            props.setTimers((prevTimers) => {
              return prevTimers.map((timer, i) => {
                if (i === index) {
                  const newTime =
                    typeof time === "function"
                      ? time(timer[2])
                      : time !== undefined
                        ? time
                        : timer[2];
                  return [timer[0], timer[1], newTime];
                }
                return timer;
              });
            });
          }}
          timer_setPaused={(paused) => {
            props.setTimers((prevTimers) => {
              return prevTimers.map((timer, i) => {
                if (i === index) {
                  return [timer[0], paused, timer[2]];
                }
                return timer;
              });
            });
          }}
          setOpenTimers={props.setOpenTimers}
          completed={props.completedSteps[index]}
          setCompleted={(completed) => {
            props.setCompleted(index, completed);
          }}
        />
      ))}
    </div>
  );
}

export default Steps;
