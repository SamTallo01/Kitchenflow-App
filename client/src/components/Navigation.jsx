/* eslint-disable react/prop-types */
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Navigation.scss";
import { FaHome } from "react-icons/fa";

function Header(props) {
  return (
    <div className="header">
      <h1>{props.title}</h1>
    </div>
  );
}

function HomeButton(props) {
  const nav = useNavigate();
  const location = useLocation();

  return (
    <button
      className="back-btn"
      onClick={() => {
        if (location.pathname != "/cooking") {
          nav("/");
        }
        if (props.onClick) {
          props.onClick();
        }
      }}
    >
      <FaHome className="icon" />
    </button>
  );
}

export { Header, HomeButton };
