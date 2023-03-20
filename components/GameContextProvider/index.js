import React, { useState } from "react";
import GameContext from "../../context";

const GameContextProvider = ({ children }) => {
  const [gameState, setGameState] = useState("home");
  const [ballSelection, setBallSelection] = useState(null);

  return (
    <GameContext.Provider
      value={{ gameState, setGameState, ballSelection, setBallSelection }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;
