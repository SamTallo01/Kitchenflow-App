import "../styles/App.scss";

function Flow(props) {
  // Calculate start times based on precedences
  const startTimes = Array(props.steps_description.length).fill(0);

  for (let i = 0; i < props.precedences.length; i++) {
    if (props.precedences[i].length > 0) {
      const maxPrecedenceTime = Math.max(
        ...props.precedences[i].map(
          (precedingStep) =>
            startTimes[precedingStep] + props.steps_time[precedingStep],
        ),
      );
      startTimes[i] = maxPrecedenceTime;
    }
  }

  const totalTime = Math.max(
    ...startTimes.map(
      (startTime, index) => startTime + props.steps_time[index],
    ),
  );

  return (
    <div className="flow">
      <div className="popup-title">
        <h2>Flow</h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#000000"
          onClick={() => props.setOpenFlow(false)}
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </div>
      {props.steps_description.map((step, index) => (
        <>
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {/* Task Description */}
            <p style={{ width: "200px", textAlign: "left", margin: "20px" }}>
              {step}
            </p>

            {/* Gantt Bar */}
            <div
              style={{
                position: "relative",
                marginLeft: `${(startTimes[index] / totalTime) * 700}px`,
                height: "20px",
                width: `${(props.steps_time[index] / totalTime) * 700}px`,
                backgroundColor: "#c70501",
                textAlign: "center",
                color: "white",
                lineHeight: "20px",
                borderRadius: "5px",
              }}
            ></div>
          </div>
          <hr style={{ width: "100%", margin: "0px 0" }} />
        </>
      ))}
    </div>
  );
}

export default Flow;
