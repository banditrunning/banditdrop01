import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Physics, usePlane, useSphere } from "@react-three/cannon";
import Model from "/components/Model";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";

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

const ThreeScene = ({ isClient }) => {
  const cameraPosition = [0, 0, 3];
  const fov = 50;
  const aspect = isClient ? window.innerWidth / window.innerHeight : 1;

  const distanceToBottom =
    Math.tan(((90 - fov / 2) * Math.PI) / 180) * cameraPosition[2];

  const groundY = distanceToBottom * aspect;
  const offsetY = 1.6;
  const groundPosition = [0, -groundY + offsetY, 0];

  const handleCollision = useCallback((e, modelRef) => {
    const contact = e.contact;

    if (!contact || !modelRef.current) {
      return;
    }

    const contactNormal = contact.normal;
    const contactPoint = contact.contactPoint;

    modelRef.current.applyImpulse(
      contactNormal.clone().multiplyScalar(100),
      contactPoint
    );

    // Generate random angular velocity values
    const randomAngularVelocity = new THREE.Vector3(
      Math.random() * 10 - 5,
      Math.random() * 10 - 5,
      Math.random() * 10 - 5
    );

    // Apply random angular velocity to the ball
    modelRef.setAngularVelocity(randomAngularVelocity);
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
            <Model position={[0, 3, 0]} onCollide={handleCollision} />
            <Ground position={groundPosition} />
          </Physics>
          <Environment preset="city" background={false} />
        </Suspense>
        <CameraControls />
      </Canvas>
    </div>
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

  return <ThreeScene isClient={isClient} />;
};

export default BallGame;
