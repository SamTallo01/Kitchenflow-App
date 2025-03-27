import "../styles/Maryposa.scss";

import { useState, useEffect } from "react";

import MaryPosa from "/mariposa.png";
import MaryPosaMute from "/mariposa_mute.png";
import MaryPosaClosed from "/mariposa_closed.png";
import { Tooltip } from "react-tooltip";

function Maryposa(props) {
  const [muted, setMuted] = useState(false);
  const [open, setOpen] = useState(false);
  const [voices, setVoices] = useState([]);

  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speaking, setSpeaking] = useState(false);

  const [isOpen, setIsOpen] = useState(true);
  const handleTooltipClick = () => {
    setIsOpen(false); // Close the tooltip when clicked
  };

  useEffect(() => {
    const t = setTimeout(() => {
      handleTooltipClick();
    }, 5000);
    return () => {
      clearTimeout(t);
    };
  }, [isOpen]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      // Automatically select a female voice if available
      const femaleVoice =
        availableVoices.find((voice) =>
          voice.name.toLowerCase().includes("female"),
        ) || availableVoices[0]; // Fallback to first voice if no match
      setSelectedVoice(femaleVoice);
    };

    // Load voices asynchronously if necessary
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = (text) => {
    if ("speechSynthesis" in window && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-Speech is not supported in your browser.");
    }
  };

  const stop = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  useEffect(() => {
    if (speaking && !muted) {
      setTimeout(() => {
        setOpen(!open);
      }, 150);
    }
    if (!speaking) {
      setOpen(false);
    }
  }, [speaking, open, muted]);

  useEffect(() => {
    if (muted) {
      stop();
    }
  }, [muted]);

  const talk = (message) => {
    if (muted) return;
    speak(message);
  };

  useEffect(() => {
    if (props.messages.length === 0) return;
    if (props.messages[props.messages.length - 1].read === false) return;
    if (props.messages[props.messages.length - 1].sender === "Maryposa") {
      talk(props.messages[props.messages.length - 1].message);
      props.messages[props.messages.length - 1].read = false;
    }
  }, [props.messages]);

  return (
    <>
      <Tooltip
        id="maryposa-tooltip"
        isOpen={isOpen}
        variant="light"
        style={{ background: "#c24b48", color: "#ffffff" }}
      />

      <div className="maryposa">
        <img
          src={muted ? MaryPosaMute : open ? MaryPosa : MaryPosaClosed}
          alt="MaryPosa"
          data-tooltip-id="maryposa-tooltip"
          data-tooltip-content="Say 'Maryposa' to talk to me!"
          data-tooltip-place="top"
          data-tooltip-offset={-30}
          onClick={() => setIsOpen(!isOpen)}
        />
        <div
          className={"maryposa-button" + (!muted ? " muted" : "")}
          onClick={() => setMuted(!muted)}
        >
          {!muted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48px"
              viewBox="0 -960 960 960"
              width="48px"
              fill="currentColor"
            >
              <path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48px"
              viewBox="0 -960 960 960"
              width="48px"
              fill="currentColor"
            >
              <path d="m616-320-56-56 104-104-104-104 56-56 104 104 104-104 56 56-104 104 104 104-56 56-104-104-104 104Zm-496-40v-240h160l200-200v640L280-360H120Zm280-246-86 86H200v80h114l86 86v-252ZM300-480Z" />
            </svg>
          )}
        </div>
      </div>
    </>
  );
}

export default Maryposa;
