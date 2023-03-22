import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Physics, usePlane, useSphere } from "@react-three/cannon";
import Model from "/components/Model";
import BlackBallModel from "/components/BlackBallModel";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import GameContext from "@/context";
import CounterBoard from "../CounterBoard";

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
    material: { restitution: 0.4 },
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

const ThreeScene = ({ isClient, tapCount, setTapCount }) => {
  const { gameState, selectedBallIndex } = useContext(GameContext);
  const [modelPosition, setModelPosition] = useState([0, 3, 0]);

  useEffect(() => {
    if (gameState === "selection") {
      setModelPosition([0, 3, 0]);
    } else {
      setModelPosition([0, 3, 0]);
    }
  }, [gameState]);

  const cameraPosition = [0, 0, 3];
  const fov = 50;
  const aspect = isClient ? window.innerWidth / window.innerHeight : 1;

  const distanceToBottom =
    Math.tan(((90 - fov / 2) * Math.PI) / 180) * cameraPosition[2];

  const groundY = distanceToBottom * aspect;
  const offsetY = 1.6;
  const groundPosition = [0, -groundY + offsetY, 0];

  const [constantRotation, setConstantRotation] = useState(
    new THREE.Vector3(0, 0, 0)
  );

  const handleCollision = useCallback((e, meshRef) => {
    const contact = e.contact;

    if (!contact || !meshRef) {
      return;
    }

    const contactNormal = contact.normal;
    const contactPoint = contact.contactPoint;

    meshRef.parent.applyImpulse(
      contactNormal.clone().multiplyScalar(100),
      contactPoint
    );

    const randomAngularVelocity = new THREE.Vector3(
      Math.random() * 20 - 10,
      Math.random() * 20 - 10,
      Math.random() * 20 - 10
    );

    setConstantRotation(randomAngularVelocity);

    meshRef.parent.setAngularVelocity(randomAngularVelocity);
  }, []);

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
        overflow: "hidden",
        right: "0",
        bottom: "0",
        width: "100%",
        zIndex: "100",
      }}
    >
      <Canvas
        camera={{
          position: cameraPosition,
          fov: 50,
          aspect: isClient ? window.innerWidth / window.innerHeight : 1,
        }}
        shadows
      >
        <spotLight
          position={[0, 20, 10]}
          intensity={gameState === "selection" ? 0.5 : 1}
          angle={Math.PI / 6}
          penumbra={1}
          castShadow
        />
        <ambientLight intensity={0.1} />
        <directionalLight intensity={0.1} />
        <Suspense fallback={null}>
          <Physics>
            {selectedBallIndex === 0 ? (
              <Model
                position={modelPosition}
                onCollide={handleCollision}
                clickable
                setTapCount={setTapCount}
                tapCount={tapCount} // Pass the callback function as a prop to Model
              />
            ) : (
              <BlackBallModel
                position={modelPosition}
                onCollide={handleCollision}
                clickable
                setTapCount={setTapCount}
                tapCount={tapCount} // Pass the callback function as a prop to Model
              />
            )}
            <Ground position={groundPosition} />
            <Environment preset="city" background={false} />
          </Physics>
        </Suspense>
        <CameraControls />
      </Canvas>
    </div>
  );
};

const Play = ({ ball }) => {
  const [isClient, setIsClient] = useState(false);
  const [tapCount, setTapCount] = useState(0); // Initialize tapCount state with a value of 0

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <ThreeScene
        isClient={isClient}
        setTapCount={setTapCount}
        tapCount={tapCount}
      />
      <div className="w-full top-[74px] left-0 right-0 fixed">
        <CounterBoard tapCount={tapCount} />
      </div>
    </>
  );
};

export default Play;
