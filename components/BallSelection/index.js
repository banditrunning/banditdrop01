import React, { useState, memo } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import RightArrow from "../RightArrow";
import LeftArrow from "../LeftArrow";

const BallSelection = ({ selectedBallIndex, setSelectedBallIndex, balls }) => {
  const BallComponent = memo(balls[selectedBallIndex].component);

  const handleArrowClick = (direction) => {
    if (direction === "left") {
      setSelectedBallIndex((index) => (index === 0 ? 1 : index - 1));
    } else if (direction === "right") {
      setSelectedBallIndex((index) => (index === 1 ? 0 : index + 1));
    }
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
          intensity={0.5}
          angle={Math.PI / 6}
          penumbra={1}
          castShadow
        />
        <ambientLight intensity={0.5} />
        <Physics>
          <BallComponent
            position={balls[selectedBallIndex].position}
            selected={true}
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
          position: "absolute",
          left: "0",
          zIndex: "101",
          fontSize: "24px",
          color: "white",
        }}
      >
        <RightArrow size={40} />
      </button>
      <button
        onClick={() => handleArrowClick("right")}
        style={{
          position: "absolute",
          right: "0",
          zIndex: "101",
          fontSize: "24px",
          color: "white",
        }}
      >
        <LeftArrow size={40} />
      </button>
    </div>
  );
};

export default BallSelection;
