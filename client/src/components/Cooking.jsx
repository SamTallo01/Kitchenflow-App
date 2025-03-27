import "../styles/Cooking.scss";
import "../styles/App.scss";
import { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import Flow from "./Flow";
import Steps from "./Steps";
import { TimerPopup, TimerSelector } from "./TimerComponents";
import { ChatBox, MessagesBox } from "./Chat";
import { Header, HomeButton } from "./Navigation";
import API from "../API";
import Maryposa from "./Maryposa";
import Ingredients from "./Ingredients";
import LeaveCooking from "./LeaveCookingPopup";
import FinishCooking from "./FinishCookingPopup";
import { useNavigate } from "react-router-dom";
Modal.setAppElement("#root");

const format_time = (seconds) => {
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

function Cooking(props) {
  const [step, setStep] = useState(0);
  const [openFlow, setOpenFlow] = useState(false);
  const [recipe, setRecipe] = useState({});
  const [steps, setSteps] = useState([]);
  const [timers, setTimers] = useState([]);
  const [openTimers, setOpenTimers] = useState([]);
  const [messages, setMessages] = useState([
    [
      {
        message:
          "Hello! I'm Maryposa, your cooking assistant. I'll guide you through the recipe. Let's start!",
        sender: "Maryposa",
        isSender: false,
        read: false,
      },
    ],
  ]);
  const [openLeaveCooking, setOpenLeaveCooking] = useState(false);
  const [openFinishCooking, setOpenFinishCooking] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      const rec = await API.getRecipe(props.id);
      setRecipe(rec);
      setSteps(
        rec.steps.map((step) => {
          step.completed = false;
          return step;
        }),
      );
      setTimers(rec.steps.map((step) => [false, false, step.estimatedTime]));
      setOpenTimers(rec.steps.map(() => false));

      const msgs = [];

      for (let i = 0; i < rec.steps.length; i++) {
        const messagesPerStep = [];
        let step = rec.steps[i];
        messagesPerStep.push({
          message: `${step.description}`,
          sender: "Maryposa",
          isSender: false,
          read: false,
          type: "text",
        });
        messagesPerStep.push({
          message: `Estimated time: ${format_time(step.estimatedTime)}`,
          sender: "Maryposa",
          isSender: false,
          read: false,
          type: "text",
        });
        if (step.image)
          messagesPerStep.push({
            url: step.image,
            sender: "Maryposa",
            isSender: false,
            read: false,
            type: "image",
          });
        msgs.push(messagesPerStep);
      }

      setMessages(msgs);
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    const messagesContainer = document.querySelector(".messages-container");
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (
      messages[step].length > 0 &&
      messages[step][messages[step].length - 1].sender === "You"
    ) {
      let response = null;
      const lastMessage =
        messages[step][messages[step].length - 1].message.toLowerCase();
      if (lastMessage.includes("next")) {
        setStep((step) => Math.min(step + 1, steps.length - 1));
      } else if (lastMessage.includes("previous")) {
        setStep((step) => Math.max(step - 1, 0));
      } else if (lastMessage.includes("hello")) {
        response = "Hello! I'm Maryposa";
      } else if (lastMessage.includes("rind") || lastMessage.includes("keep")) {
        messages[step][messages[step].length - 1].message =
          "Should I keep the rind on?";
        response = "No, you should remove the rind, it's not edible.";
      } else if (lastMessage.includes("set")) {
        messages[step][messages[step].length - 1].message =
          "How should I set the heat?";
        response =
          "You should adjust the heat to maximum. Deglazing needs high temperatures!";
      } else {
        response = "I'm sorry, I didn't understand that.";
      }

      if (response != null) {
        setMessages((prevMessages) => {
          return prevMessages.map((prev, i) => {
            if (i === step) {
              return [
                ...prev,
                {
                  message: response,
                  sender: "Maryposa",
                  isSender: false,
                },
              ];
            }
            return prev;
          });
        });
      }
    }
  }, [messages, step]);

  return (
    <div className="cooking">
      <div className="blurry-background"></div>
      <Maryposa messages={messages[step]} />
      <HomeButton onClick={() => setOpenLeaveCooking(true)} />
      <Header title={`Cooking time: ${recipe.name}`}></Header>
      <div className="left-column">
        <div className="steps-header">
          <h2>STEPS</h2>
          <div className="flow-button" onClick={() => setOpenFlow(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
              transform="rotate(90)"
            >
              <path d="M120-160v-240h120v240H120Zm200-240v-200h120v200H320Zm200-200v-200h120v200H520Zm200 440v-640h120v640H720Z" />
            </svg>
            {"Flow"}
          </div>
        </div>
        <Steps
          steps_description={steps.map((step) => step.name)}
          step={step}
          setStep={setStep}
          timers={timers}
          setTimers={setTimers}
          setOpenTimers={setOpenTimers}
          defaultTimes={steps.map((step) => step.estimatedTime)}
          completedSteps={steps.map((step) => step.completed)}
          setCompleted={(index, value) => {
            setSteps((prevSteps) => {
              return prevSteps.map((prevStep, i) => {
                if (i === index) {
                  return { ...prevStep, completed: value };
                }
                return prevStep;
              });
            });
          }}
        />
      </div>
      {step != 0 && (
        <div
          className="empty-button previous"
          onClick={() => setStep((step) => Math.max(step - 1, 0))}
        >
          <h4>{"< Previous"}</h4>
        </div>
      )}
      {step != steps.length - 1 ? (
        <div
          className="empty-button next"
          onClick={() =>
            setStep((step) => Math.min(step + 1, steps.length - 1))
          }
        >
          <h4>{"Next >"}</h4>
        </div>
      ) : (
        <div
          className="button finish"
          onClick={async () => {
            if (steps.every((step) => step.completed)) {
              if (recipe.id === 1) {
                await API.updateRedeemable(3, 1);
              }
              nav("/recap", { state: { recipe: recipe } });
            } else setOpenFinishCooking(true);
          }}
        >
          <h4>{"Finish "}</h4>
        </div>
      )}

      <Ingredients ingredients={recipe.ingredients} portions={props.portions} />

      <Modal
        isOpen={openFlow}
        onRequestClose={() => {}}
        contentLabel="Flow"
        className="modal"
      >
        <Flow
          steps_description={steps.map((step) => step.name)}
          setOpenFlow={setOpenFlow}
          steps_time={steps.map((step) => step.estimatedTime)}
          precedences={steps.map((step) =>
            step.precedence
              .split(",")
              .filter((s) => s !== "")
              .map((s) => parseInt(s)),
          )}
        />
      </Modal>
      {openTimers.map((openTimer, index) => {
        return (
          <Modal
            key={index}
            isOpen={openTimer}
            onRequestClose={() => {}}
            contentLabel="Timer"
            className="modal"
          >
            <TimerPopup
              index={index}
              timers={timers}
              setTimers={setTimers}
              defaultTime={steps[index].estimatedTime}
              step_description={steps[index].name}
              setOpenTimer={(value) => {
                setOpenTimers((prev) =>
                  prev.map((prevValue, i) => (i === index ? value : prevValue)),
                );
              }}
              time={timers[index][2]}
              timer_setActive={(active) => {
                setTimers((prevTimers) => {
                  return prevTimers.map((timer, i) => {
                    if (i === index) {
                      return [active, timer[1], timer[2]];
                    }
                    return timer;
                  });
                });
              }}
              timer_setPaused={(paused) => {
                setTimers((prevTimers) => {
                  return prevTimers.map((timer, i) => {
                    if (i === index) {
                      return [timer[0], paused, timer[2]];
                    }
                    return timer;
                  });
                });
              }}
              timer_setTime={(time) => {
                setTimers((prevTimers) => {
                  return prevTimers.map((timer, i) => {
                    if (i === index) {
                      return [timer[0], timer[1], time];
                    }
                    return timer;
                  });
                });
              }}
              active={timers[index][0]}
              paused={timers[index][1]}
            />
          </Modal>
        );
      })}
      <Modal
        isOpen={openLeaveCooking}
        onRequestClose={() => {}}
        contentLabel="Leave Cooking"
        className="modal"
      >
        <LeaveCooking setOpenLeaveCooking={setOpenLeaveCooking} />
      </Modal>
      <Modal
        isOpen={openFinishCooking}
        onRequestClose={() => {}}
        contentLabel="Finish Cooking"
        className="modal"
      >
        <FinishCooking
          setOpenFinishCooking={setOpenFinishCooking}
          recipe={recipe}
        />
      </Modal>
      <ChatBox
        sendMessage={(message) => {
          if (message == "") return;
          setMessages((prevMessages) => {
            return prevMessages.map((prev, i) => {
              if (i === step) {
                return [...prev, { message, sender: "You", isSender: true }];
              }
              return prev;
            });
          });
        }}
      />
      <MessagesBox messages={messages[step]} />
    </div>
  );
}

export default Cooking;
