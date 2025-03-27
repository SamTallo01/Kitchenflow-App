import { useNavigate } from "react-router-dom";
import "../styles/Home.scss";
import { useEffect } from "react";

function Home() {
  const nav = useNavigate();

  useEffect(() => {
    const mic = async () => {
      try {
        // Richiede l'accesso al microfono
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        console.log("Accesso al microfono garantito:", stream);
        // Puoi utilizzare il stream per elaborazioni successive
      } catch (err) {
        console.error("Accesso al microfono negato:", err);
      }
    };

    mic();
  }, []);

  return (
    <div className="background-home">
      <div className="title">KitchenFlow</div>
      <div className="button-container">
        <button className="cooking-time-btn" onClick={() => nav("/recipes")}>
          Cooking Time
        </button>
        <button className="profile-btn" onClick={() => nav("/profile")}>
          Profile
        </button>
      </div>
    </div>
  );
}

export default Home;
