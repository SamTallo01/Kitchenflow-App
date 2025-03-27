import { Header, HomeButton } from "./Navigation";
import { useNavigate, useLocation  } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Badge } from "./Profile";
import BadgePopup from "./BadgePopup.jsx";
import Modal from "react-modal";
import API from "../API.js";
import "../styles/Recap.scss";
import "../styles/App.scss";

Modal.setAppElement("#root");

const Recap = () => {
  const nav = useNavigate();
  const location = useLocation();
  const recipe = location.state?.recipe;

  // Stato per gestire i dati dei badge
  const [badgesData, setBadgesData] = useState([]);

  // Stato per il popup
  const [showPopup, setShowPopup] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  // Funzione per aggiornare lo stato quando un badge viene riscattato
  const updateBadge = (id, updatedBadge) => {
    const newBadgesData = badgesData.map((badge) =>
      badge.id === id ? { ...badge, ...updatedBadge } : badge,
    );
    setBadgesData(newBadgesData);
  };

  // Effetto per ottenere i dati dei badge
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await API.getAllBadges(); // Chiamata API per ottenere i badge
  
        // Verifica se il badge con id === 3 è unlocked
        const badgeWithId3 = response.find((badge) => badge.id === 3);
        if (badgeWithId3 && badgeWithId3.unlocked === 1 && badgeWithId3.redeemable === 1) {
          // Se è unlocked, aggiorna redeemable a 0 nel DB
          await API.updateRedeemable(3, 0);
  
          // Aggiorna localmente il badge con redeemable: 0
          const updatedBadges = response.map((badge) =>
            badge.id === 3 ? { ...badge, redeemable: 0 } : badge
          );
          setBadgesData(updatedBadges); // Salva i badge aggiornati nello stato
        } else {
          setBadgesData(response); // Salva i badge senza modifiche
        }
      } catch (error) {
        console.error("Error fetching badges data:", error);
      }
    };
  
    fetchBadges();
  }, []);

  
  // Funzione per gestire il clic su un badge
  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge); // Salva il badge selezionato
    setShowPopup(true); // Mostra il popup
  };

  // Funzione per gestire il riscatto di un badge
  const handleRedeem = async (id) => {
    try {
      // Aggiorna il badge tramite chiamate API
      await API.updateRedeemable(id, 0); // Imposta 'redeemable' a 0
      await API.updateUnlocked(id, 1); // Imposta 'unlocked' a 1

      // Aggiorna lo stato localmente
      updateBadge(id, { redeemable: 0, unlocked: 1 });
    } catch (error) {
      console.error("Error redeeming badge:", error);
    }
  };

  const closePopup = () => {
    setShowPopup(false); // Chiude il popup
  };

  return (
    <div>
      <div className="blurry-background"></div>
      <div>
        <Header title={`Cooking time: recap`}></Header>
        <HomeButton />
      </div>
      <div className="recap">
        <div className="recap-content">
          <div>
            <div className="time-section">
              <div className="time-header">
                <h2 className="time-title">Your time</h2>
                <h2 className="time-title"> Time saved</h2>
              </div>
              <div className="time-content">
                <p className="time-text">{(recipe.estimated_time/100)*80} min</p>
                <p className="saved-time">{recipe.estimated_time-(recipe.estimated_time/100)*80} min</p>
              </div>
            </div>
            
            <hr className="separator"/>

            <div className="badges-section">
              <h2>Earned Badges</h2>
              <div className="badges">
                {recipe.estimated_time <= 30 ? 
                  badgesData.slice(2, 3).map((badge) => (
                  <Badge
                    key={badge.id}
                    {...badge}
                    onClick={handleBadgeClick}
                    onRedeem={() => handleRedeem(badge.id)}
                  />
                )) : (
                  <p>You didn't obtain any badge </p>
                )}
                
              </div>
            </div>
            <div className="navigation">
              <button
                className="profile-button"
                onClick={() => nav("/profile")}
              >
                Profile
              </button>
              <button className="home-btn" onClick={() => nav("/")}>
                Home
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal per il BadgePopup */}
      <Modal
        isOpen={showPopup}
        onRequestClose={closePopup}
        contentLabel="Badge Details"
        className="modal"
      >
        {selectedBadge && (
          <BadgePopup badge={selectedBadge} closePopup={closePopup} />
        )}
      </Modal>
    </div>
  );
};

export default Recap;
