import React, { useContext } from "react";
import Symbol from "../Symbol";
import GameContext from "@/context";
import RightArrow from "@/components/RightArrow";
import Countdown from "./Countdown";

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
    <div
      className={`${
        gameState === "gameplay" ? "bg-none z-[99]" : "bg-black z-[101]"
      } fixed top-0 left-0 right-0`}
    >
      <div
        className={`flex flex-row w-full items-center justify-between py-4 px-4 border-b border-solid border-white ${
          showContent
            ? "opacity-100 transition-opacity duration-1000 ease-in"
            : "opacity-0"
        }`}
      >
        {gameState === "home" || gameState === "leaderboard" ? (
          <Symbol />
        ) : (
          <div onClick={handleClick}>
            <RightArrow size={24} />
          </div>
        )}
        <span className="text-xl text-black font-GroteskRegular">
          <Countdown />
        </span>
      </div>
    </div>
  );
}
