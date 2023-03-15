import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Model from "/components/Model";
import { Environment } from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import { usePlane } from "@react-three/cannon";
import { useControls } from "@react-three/drei";
import { extend, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useRef } from "react";
import { useEffect, useState } from "react";
extend({ OrbitControls });

const Ground = (props) => {
  const [positionY, setPositionY] = useState(-2.75);

  useEffect(() => {
    const setGroundPosition = () => {
      const aspectRatio = window.innerWidth / window.innerHeight;
      setPositionY(-aspectRatio * 3);
    };

    setGroundPosition();
    window.addEventListener("resize", setGroundPosition);

    return () => {
      window.removeEventListener("resize", setGroundPosition);
    };
  }, []);

  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, positionY, 0],
    material: { restitution: 0.6 },
    ...props,
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <shadowMaterial attach="material" transparent opacity={0.5} />
    </mesh>
  );
};

const CameraControls = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  const controls = useRef();
  useFrame((state) => controls.current?.update());

  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      enableZoom={false}
      enablePan={false}
      enableRotate={false}
      target={[0, 0, 0]}
      autoRotate={false}
    />
  );
};

const BallGame = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const cameraPosition = [0, 0, 3];
  const fov = 50;
  const aspect = isClient ? window.innerWidth / window.innerHeight : 1;

  // Calculate the distance from the camera to the bottom border
  const distanceToBottom =
    Math.tan(((90 - fov / 2) * Math.PI) / 180) * cameraPosition[2];

  // Calculate the y-coordinate of the ground
  const groundY = distanceToBottom * aspect;

  // Position the ground slightly above the bottom border
  const offsetY = 1; // Adjust this value to control how far above the bottom border the ground should be
  const groundPosition = [0, -groundY + offsetY, 0];

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
      <Canvas
        camera={{
          position: [0, 0, 3],
          fov: 50,
          aspect: isClient ? window.innerWidth / window.innerHeight : 1,
        }}
        shadows
      >
        <spotLight
          position={[0, 20, 10]}
          intensity={1}
          angle={Math.PI / 6}
          penumbra={1}
          castShadow
        />
        <ambientLight intensity={0.2} />
        <ambientLight intensity={0.1} />
        <directionalLight intensity={0.1} />
        <Suspense fallback={null}>
          <Physics gravity={[0, -10, 0]}>
            <Model position={[0, 3, 0]} />
            <Ground position={groundPosition} />
          </Physics>
          <Environment preset="city" background={false} />
        </Suspense>
        <CameraControls />
      </Canvas>
    </div>
  );
};

export default BallGame;
