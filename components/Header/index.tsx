import React, { useContext } from "react";
import Symbol from "../Symbol";
import GameContext from "@/context";
import RightArrow from "@/components/RightArrow";

export default function Header(props: { showContent: boolean }) {
  const { showContent } = props;
  const { gameState, setGameState } = useContext(GameContext);

  const handleClick = () => {
    if (gameState === "gameplay") {
      setGameState("selection");
    } else if (gameState === "selection") {
      setGameState("home");
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-black z-[101]">
      <div
        className={`flex flex-row w-full items-center justify-between border-b border-solid border-white pt-6 pb-4 px-4 ${
          showContent
            ? "opacity-100 transition-opacity duration-1000 ease-in"
            : "opacity-0"
        }`}
      >
        {gameState === "home" ? (
          <Symbol />
        ) : (
          <div onClick={handleClick}>
            <RightArrow size={24}/>
          </div>
        )}
      </div>
    </div>
  );
}
