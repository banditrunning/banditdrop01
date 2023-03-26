import React, { useState, useMemo, useContext, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import RightArrow from "../RightArrow";
import LeftArrow from "../LeftArrow";
import GameContext from "@/context";

const BallSelection = ({ balls, rotation }) => {
  const { selectedBallIndex, setSelectedBallIndex, setGameState } =
    useContext(GameContext);

  const BallComponent = useMemo(() => {
    if (balls && balls[selectedBallIndex]) {
      return memo(balls[selectedBallIndex].component);
    }
    return null;
  }, [balls, selectedBallIndex]);

  const handleArrowClick = (direction) => {
    if (direction === "left") {
      setSelectedBallIndex((index) => {
        return index === 0 ? balls.length - 1 : index - 1;
      });
    } else if (direction === "right") {
      setSelectedBallIndex((index) => (index + 1) % balls.length);
    }
  };

  const handlePlayTap = () => {
    setGameState("gameplay");
    setSelectedBallIndex(selectedBallIndex);
    console.log("selectedBallIndex", selectedBallIndex);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        width: "100%",
        zIndex: "100",
      }}
    >
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <spotLight
          position={[0, 20, 10]}
          intensity={0.75}
          angle={Math.PI / 6}
          penumbra={1}
          castShadow
        />
        <ambientLight intensity={0.5} />
        <Physics>
          <BallComponent
            position={[0, 0, 0]}
            selected={true}
            rotation={rotation}
          />
        </Physics>
      </Canvas>
      <div
        style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          border: "2px solid white",
          zIndex: "101",
        }}
      ></div>
      <button
        onClick={() => handleArrowClick("left")}
        style={{
          position: "fixed",
          left: "0",
          zIndex: "101",
          fontSize: "24px",
          color: "white",
          marginLeft: "20px",
        }}
      >
        <RightArrow size={40} />
      </button>
      <button
        onClick={() => handleArrowClick("right")}
        style={{
          position: "fixed",
          right: "0",
          zIndex: "101",
          fontSize: "24px",
          color: "white",
          marginRight: "20px",
        }}
      >
        <LeftArrow size={40} />
      </button>
      <button
        onClick={handlePlayTap}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "0",
          right: "0",
          marginLeft: "auto",
          marginRight: "auto",
          zIndex: "101",
          fontSize: "24px",
          fontFamily: "grotesk-regular",
          textTransform: "uppercase",
          color: "white",
          padding: "10px 20px",
          borderRadius: "5px",
          backgroundColor: "#C97900",
          width: "92%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Play <LeftArrow />
      </button>

      <div
        style={{
          position: "fixed",
          bottom: "150px",
          left: "0",
          right: "0",
          marginLeft: "auto",
          marginRight: "auto",
          zIndex: "101",
          fontSize: "24px",
          fontFamily: "grotesk-medium",
          textTransform: "uppercase",
          color: "black",
          padding: "0px",
          borderRadius: "5px",
          backgroundColor: "white",
          width: "130px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selectedBallIndex === 1 ? "AWAY" : "HOME"}
      </div>
    </div>
  );
};

export default BallSelection;
