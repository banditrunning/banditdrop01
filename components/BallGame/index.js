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

extend({ OrbitControls });

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
      target={[0, 0, 0]}
      autoRotate={false}
    />
  );
};

const Ground = (props) => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    material: { restitution: 0.6 }, // Adjust this value to control the ground's bounciness
    ...props,
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <shadowMaterial attach="material" transparent opacity={0.5} />
    </mesh>
  );
};

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
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }} shadows>
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
            <Ground position={[0, -2.75, 0]} />
          </Physics>
          <Environment preset="city" background={false} />
        </Suspense>
        <CameraControls />
      </Canvas>
    </div>
  );
};

export default BallGame;
