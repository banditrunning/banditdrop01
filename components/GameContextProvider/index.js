import React, { useState } from "react";
import GameContext from "../../context";

const GameContextProvider = ({ children }) => {
  const [gameState, setGameState] = useState("home");
  const [selectedBallIndex, setSelectedBallIndex] = useState(null);

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        selectedBallIndex,
        setSelectedBallIndex,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;
