import { Route, Routes } from "react-router-dom";
import "./styles/App.scss";
import Home from "./components/Home";
import Cooking from "./components/Cooking";
import { Profile } from "./components/Profile.jsx";
import Recipes from "./components/Recipes";
import Recap from "./components/Recap";
import { useState } from "react";

function App() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [numPortions, setNumPortions] = useState(1);
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route
        path="/recipes"
        element={
          <Recipes
            setNumPortions={setNumPortions}
            setSelectedRecipe={setSelectedRecipe}
          />
        }
      ></Route>
      <Route
        path="/cooking"
        element={<Cooking id={selectedRecipe} portions={numPortions} />}
      ></Route>
      <Route path="/profile" element={<Profile />}></Route>
      <Route path="/recap" element={<Recap />}></Route>
    </Routes>
  );
}

export default App;
