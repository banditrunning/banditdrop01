import React, { useState } from "react";
import GameContext from "../../context";

const GameContextProvider = ({ children }) => {
  const [gameState, setGameState] = useState("home"); // or use an object if you have more state

  return (
    <GameContext.Provider value={{ gameState, setGameState }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;
