import "../styles/Chat.scss";
import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const ChatBox = (props) => {
  const [wavesActive, setWavesActive] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [listening, setListening] = useState(false);
  const keywords = ["ma riposa", "mariposa", "mary posa"]; // Replace with your keyword
  const [recognizing, setRecognizing] = useState(false);
  const { transcript, resetTranscript } = useSpeechRecognition();

  const handleSubmit = (e) => {
    // Prevent default form submission behavior (e.g., page reload)
    e.preventDefault();

    if (inputValue.trim()) {
      props.sendMessage(inputValue); // Send message logic
      setInputValue(""); // Clear input field after sending
    }
  };

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert("Your browser doesn't support speech recognition.");
    }
  }, []);

  useEffect(() => {
    // Check for the keyword in the transcript
    if (
      keywords.some((keyword) => transcript.toLowerCase().includes(keyword))
    ) {
      toggleWaves();
      resetTranscript();
      setRecognizing(true);
    }
  }, [transcript, keywords, resetTranscript]);

  useEffect(() => {
    if (recognizing) {
      const timer = setTimeout(() => {
        if (props.sendMessage) {
          props.sendMessage(transcript);
        } else {
          console.log("Message: ", transcript);
        }
        setRecognizing(false);
        resetTranscript();
        toggleWaves();
        console.log("Message sent!");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [recognizing, transcript]);

  const startListening = () => {
    setListening(true);
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    setListening(false);
    SpeechRecognition.stopListening();
  };

  useEffect(() => {
    startListening();
  }, []);

  // Handle microphone toggle
  const toggleWaves = () => {
    setWavesActive(!wavesActive);
  };

  return (
    <form className="chat-container" onSubmit={handleSubmit}>
      {/* Animated Waves */}
      <div className="wave-container">
        <span className={`wave ${wavesActive ? "active" : ""}`}></span>
        <span className={`wave ${wavesActive ? "active" : ""}`}></span>
        <span className={`wave ${wavesActive ? "active" : ""}`}></span>
      </div>

      {/* Microphone Icon */}

      {listening ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#000000"
          onClick={() => {
            stopListening();
          }}
        >
          <path d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm0-240Zm-40 520v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Zm40-360q17 0 28.5-11.5T520-520v-240q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240q0 17 11.5 28.5T480-480Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#000000"
          onClick={() => {
            startListening();
          }}
        >
          <path d="m710-362-58-58q14-23 21-48t7-52h80q0 44-13 83.5T710-362ZM480-594Zm112 112-72-72v-206q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v126l-80-80v-46q0-50 35-85t85-35q50 0 85 35t35 85v240q0 11-2.5 20t-5.5 18ZM440-120v-123q-104-14-172-93t-68-184h80q0 83 57.5 141.5T480-320q34 0 64.5-10.5T600-360l57 57q-29 23-63.5 39T520-243v123h-80Zm352 64L56-792l56-56 736 736-56 56Z" />
        </svg>
      )}
      {/* Chat Input */}

      <input
        type="text"
        placeholder="Chat with MaryPosa"
        className="chat-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      {/* Send Arrow */}
      <button type="submit" className="send-icon">
        ➤
      </button>
    </form>
  );
};

const MessageBubble = ({
  message,
  sender,
  isSender,
  firstMessage,
  type,
  url,
}) => {
  return (
    <div className={`bubble-container ${isSender ? "left" : "right"}`}>
      <div className={"message-bubble " + (firstMessage ? "first" : "")}>
        {url ? (
          <img src={url} alt="Sent content" className="message-image" />
        ) : (
          <span className="message-text">{message}</span>
        )}
        <span className="sender-name">{sender}</span>
      </div>
    </div>
  );
};

function MessagesBox(props) {
  return (
    <div className="messages-container">
      {props.messages.map((message, index) => (
        <MessageBubble
          key={index}
          message={message.message}
          sender={message.sender}
          isSender={message.isSender}
          firstMessage={index === 0}
          type={message.type}
          url={message.url}
        />
      ))}
    </div>
  );
}

export { ChatBox, MessageBubble, MessagesBox };
