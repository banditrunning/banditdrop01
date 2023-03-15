import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Model from "/components/Model";
import { OrbitControls, Environment } from "@react-three/drei";
import { Physics } from "@react-three/cannon";

const BallGame = () => {
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
      }}
    >
      <Canvas camera={{ position: [0, 0, 3], fov: 15 }}>
        <pointLight position={[0, 20, 10]} intensity={0.1} />
        <ambientLight intensity={0.2} />
        <ambientLight intensity={0.1} />
        <directionalLight intensity={0.1} />
        <Suspense fallback={null}>
          <Physics gravity={[0, -10, 0]}>
            <Model position={[0, 0, 0]} />
          </Physics>
          <Environment preset="city" background={false} />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          target={[0, 0, 0]}
          autoRotate
        />
      </Canvas>
    </div>
  );
};

export default BallGame;
