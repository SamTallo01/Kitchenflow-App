import { useState, useEffect } from "react";
import "../styles/Profile.scss";
import { FaClock, FaUtensils, FaLock } from "react-icons/fa";
import { Header, HomeButton } from "./Navigation";
import API from "../API.js";
import BadgePopup from "./BadgePopup.jsx";
import Modal from "react-modal";

Modal.setAppElement("#root");

function ProfileInfo({ badgesData }) {
  const cookedMeals = badgesData.some((badge) => badge.id === 3 && (badge.redeemable === 1 || badge.unlocked === 1)) ? 2 : 1;
  const timeSaved = badgesData.some((badge) => badge.id === 3 && (badge.redeemable === 1|| badge.unlocked === 1)) ? 26 : 20;

  return (
    <div className="profile-info">
      <div className="profile-pic">
        <img src={"./ProfilePic.jpg"} alt="ProfilePic" />
      </div>
      <div className="profile-details">
        <h2>FRANCO COLAPINTO</h2>
        <p>
          <FaClock className="icon" />
          <strong>Total time saved: </strong>{timeSaved} min
        </p>
        <p>
          <FaUtensils className="icon" />
          <strong>Number of cooked meals: </strong>{cookedMeals}
        </p>
      </div>
    </div>
  );
}

function Badge({
  id,
  name,
  description,
  unlocked,
  redeemable,
  hint,
  onClick,
  onRedeem,
}) {
  return (
    <div className="badge-container">
      <div
        className={`badge ${!unlocked ? "locked" : ""}`}
        onClick={() =>
          onClick({
            id,
            name,
            description,
            hint,
            unlocked,
            redeemable,
          })
        }
      >
        {!unlocked ? (
          <FaLock className="lock-icon" />
        ) : (
          <>
            <span className="badge-title">{name}</span>
            {/* <p>{description}</p> */}
          </>
        )}
      </div>
      {redeemable ? (
        <button className="redeem-btn" onClick={onRedeem}>
          Redeem
        </button>
      ) : null}
    </div>
  );
}

function Badges({ badgesData, updateBadge }) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleRedeem = async (id) => {
    try {
      await API.updateRedeemable(id, 0); // Aggiorna 'redeemable' a 0
      await API.updateUnlocked(id, 1); // Aggiorna 'unlocked' a 1

      // Aggiorna il badge localmente
      updateBadge(id, { redeemable: 0, unlocked: 1 });
    } catch (error) {
      console.error("Error updating badge:", error);
    }
  };

  return (
    <div className="badges-section">
      <h2>Badges:</h2>
      <div className="badges">
        {badgesData.map((badge) => (
          <Badge
            key={badge.id}
            {...badge}
            onClick={handleBadgeClick}
            onRedeem={() => handleRedeem(badge.id)}
          />
        ))}
      </div>

      <Modal
        isOpen={showPopup}
        onRequestClose={() => {
          setShowPopup(false);
        }}
        contentLabel="BadgePopup"
        className="modal"
      >
        <BadgePopup badge={selectedBadge} closePopup={closePopup} />
      </Modal>
    </div>
  );
}

function Profile() {
  const [badgesData, setBadgesData] = useState([]);
  const [updatedBadgesData, setUpdatedBadgesData] = useState([]);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await API.getAllBadges();
        setBadgesData(response);
        setUpdatedBadgesData(response);
      } catch (error) {
        console.error("Error fetching badges data:", error);
      }
    };

    fetchBadges();
  }, []);

  const updateBadge = (id, updatedBadge) => {
    const newBadgesData = updatedBadgesData.map((badge) =>
      badge.id === id ? { ...badge, ...updatedBadge } : badge,
    );
    setUpdatedBadgesData(newBadgesData);
  };

  if (!updatedBadgesData) {
    return <div>No badges data available</div>;
  }

  return (
    <div className="profile">
      <div className="blurry-background"></div>
      <Header title={"Your Profile"} />
      <HomeButton />
      <div className="profile-content">
        <ProfileInfo badgesData={updatedBadgesData} />
        <Badges badgesData={updatedBadgesData} updateBadge={updateBadge} />
      </div>
    </div>
  );
}

export { Profile, Badge, Badges };
