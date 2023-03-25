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
import { TextureLoader } from "three";

extend({ OrbitControls });

const Ground = (props) => {
  const [positionY, setPositionY] = useState(-2.75);
  const [texture, setTexture] = useState();

  useEffect(() => {
    const loader = new TextureLoader();
    loader.load("/public/static/textures/away_texture.png", (loadedTexture) => {
      setTexture(loadedTexture);
    });
  }, []);
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
      <meshPhongMaterial
        attach="material"
        map={texture}
        color={"#333333"}
        metalness={1}
        roughness={1}
      />
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

const ThreeScene = ({
  isClient,
  tapCount,
  setTapCount,
  gameOver,
  setGameOver,
}) => {
  const { gameState, selectedBallIndex } = useContext(GameContext);
  const [modelPosition, setModelPosition] = useState([0, -0.43, 0]);
  const [hasStarted, setHasStarted] = useState(false);
  const [collisionCount, setCollisionCount] = useState(0);
  const [hasCollidedAfterFirstTap, setHasCollidedAfterFirstTap] =
    useState(false);

  useEffect(() => {
    if (gameState === "selection") {
      setModelPosition([0, 3, 0]);
    } else {
      setModelPosition([0, -0.43, 0]);
    }
  }, [gameState]);

  const cameraPosition = [-2, 0, 1.3];
  const fov = 49;
  const aspect = isClient ? window.innerWidth / window.innerHeight : 1;

  const distanceToBottom =
    Math.tan(((90 - fov / 2) * Math.PI) / 180) * cameraPosition[2];

  const groundY = distanceToBottom * aspect;
  const offsetY = 1;
  const groundPosition = [0, -groundY + offsetY, 0];

  const tapCountRef = useRef(0);

  const handleCollision = useCallback(
    (e, meshRef) => {
      const contact = e.contact;
      if (!contact || !meshRef) {
        return;
      }

      if (!hasStarted) {
        setHasStarted(true);
      }

      setCollisionCount((count) => {
        const updatedCount = count + 1;
        console.log("Collision count:", updatedCount);
        console.log(tapCountRef.current);

        if (tapCountRef.current >= 1 && count >= 1) {
          console.log("Game over!");
          setGameOver(true);
        }

        return updatedCount;
      });
    },
    [hasStarted]
  );

  useEffect(() => {
    tapCountRef.current = tapCount;
  }, [tapCount]);

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
        frameloop="demand"
        limit={60}
      >
        <spotLight
          position={[0, 5, 0]}
          intensity={0.5}
          angle={Math.PI / 6}
          penumbra={1}
          castShadow
        />
        <ambientLight intensity={0.1} />
        <directionalLight intensity={0.1} />
        <Suspense fallback={null}>
          <Physics gravity={[0, -8, 0]}>
            {selectedBallIndex === 0 ? (
              <Model
                position={modelPosition}
                onCollide={(e, meshRef) => handleCollision(e, meshRef)}
                clickable
                setTapCount={gameState === "gameplay" && setTapCount}
                tapCount={gameState === "gameplay" && tapCount}
              />
            ) : (
              <BlackBallModel
                position={modelPosition}
                onCollide={(e, meshRef) => handleCollision(e, meshRef)}
                clickable
                setTapCount={setTapCount}
                tapCount={tapCount}
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
  const [tapCount, setTapCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);

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
        setGameOver={setGameOver}
      />
      <div
        className={`w-full top-[74px] left-0 right-0 fixed ${
          gameOver === true ? "z-[1000]" : ""
        }`}
      >
        <CounterBoard tapCount={tapCount} gameOver={gameOver} />
      </div>
    </>
  );
};

export default Play;
