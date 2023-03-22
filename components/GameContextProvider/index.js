import React, { useState } from "react";
import GameContext from "../../context";

const GameContextProvider = ({ children }) => {
  const [gameState, setGameState] = useState("home");
  const [selectedBallIndex, setSelectedBallIndex] = useState(0);
  const [tapCount, setTapCount] = useState(0); // Add tapCount state variable

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        selectedBallIndex,
        setSelectedBallIndex,
        tapCount, // Add tapCount to the context value
        setTapCount, // Add setTapCount to the context value
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;
