import React, { useRef, useEffect, useMemo, useContext, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import { useSphere } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import GameContext from "@/context";
import { useGesture } from "react-use-gesture";
import { useSound } from "use-sound";
import kick from "public/sounds/kick.mp4";
import kickMetal from "public/sounds/kickMetal.mp4";
import * as THREE from "three";
import { MeshStandardMaterial } from "three";

function Model({
  position,
  onCollide,
  clickable,
  tapCount,
  setTapCount,
  tapHandler,
  gameOver,
  ...props
}) {
  const { gameState } = useContext(GameContext); // Access the gameState variable from context
  const { nodes, materials } = useGLTF("../models/Football.glb");
  const [playKickSound] = useSound(kick);
  const [playMetalKickSound] = useSound(kickMetal);

  const [ref, api] = useSphere((index) => ({
    mass: gameState === "selection" ? 0 : 0.9,
    position: position,
    args: [scaledBallRadius],
    material: { restitution: 1.2 },
    rotation: [0, 0, 0],
    onCollide: (e) => {
      onCollide && onCollide(e, ref);
    },
    ...props,
  }));

  const [inAir, setInAir] = useState(false);

  useFrame(({ delta }) => {
    // Check if the ball is in the air
    if (ref.current.position.y > 0) {
      setInAir(true);
    } else {
      setInAir(false);
    }
  });

  const targetPosition = useRef(new Vector3(...position));

  // Calculate the bounding box of the mesh
  const box = new Box3().setFromObject(nodes.Solid);

  // Calculate the size of the bounding box
  const size = new Vector3();
  box.getSize(size);
  const ballRadius = size.length() / (2 * Math.sqrt(3));
  const scaledBallRadius = ballRadius * 0.25;

  // Calculate the center of the bounding box
  const center = new Vector3();
  box.getCenter(center);

  useEffect(() => {
    targetPosition.current.set(...position);
  }, [position]);

  useEffect(() => {
    if (ref.current && onCollide && gameState === "gameplay") {
      const handleCollide = (e) => {
        onCollide(e, ref.current.children[0]);
      };
      ref.current.addEventListener("collide", handleCollide);
    }
  }, [ref, onCollide]);

  const refCurrent = ref.current;
  const tapTargetRef = useRef();
  const [tapTargetRadius, setTapTargetRadius] = useState(
    scaledBallRadius * 1.1
  );
  useEffect(() => {
    tapTargetRef.current.geometry = new THREE.SphereBufferGeometry(
      tapTargetRadius,
      32,
      32
    );
    tapTargetRef.current.material.transparent = true;
    tapTargetRef.current.material.opacity = 0;
    tapTargetRef.current.renderOrder = 9999;
    tapTargetRef.current.position.copy(ref.current.position);
  }, [tapTargetRadius, ref]);

  const bind = useGesture(
    {
      onPointerDown: () => {},
      onPointerUp: () => {
        // Existing code
        if (api) {
          // check if api is defined
          if (gameState === "home") {
            api.velocity.set(0, 6, 0);
          } else {
            api.velocity.set(0, 4, 0);
          }
          if (tapCount < 10) {
            playKickSound();
          } else if (
            tapCount >= 10 &&
            gameState === "gameplay" &&
            gameOver === false
          ) {
            playMetalKickSound();
          }
          if (gameState === "home") {
            playKickSound();
            tapHandler();
          }
        }
        if (gameState === "gameplay") {
          setTapCount(tapCount + 1);
        }
      },
    },
    {
      // Set passive: true to improve scrolling performance
      // and prevent default touch behavior
      passive: true,
      // Enable pointer events for both touch and mouse input
      pointerEvents: { touch: true, mouse: true },
    }
  );

  const [angularVelocity, setAngularVelocity] = useState([0, 0, 0]);

  useEffect(() => {
    if (api) {
      // Set up the loop that applies the damping torque
      const intervalId = setInterval(() => {
        api.velocity.subscribe((velocity) => {
          setAngularVelocity(velocity);
        });
      }, 1000 / 60); // Run the loop at 60 FPS

      // Clean up the interval when the component unmounts
      return () => clearInterval(intervalId);
    }
  }, [api]);

  // Apply damping torque using useEffect
  useEffect(() => {
    if (api && inAir) {
      const dampingFactor = -0.05; // adjust this value to control the amount of damping torque

      // Calculate the damping torque
      const dampingTorque = angularVelocity.map((v) => v * dampingFactor);

      // Apply the damping torque
      api.applyTorque(dampingTorque);

      // If the ball is on the ground, set the angular velocity to zero
      if (ref.current.position.y < scaledBallRadius) {
        api.angularVelocity.set(0, 0, 0);
      }
    }
  }, [api, angularVelocity, inAir, ref, scaledBallRadius]);

  return (
    <>
      <mesh ref={tapTargetRef} />
      <group
        ref={ref}
        dispose={null}
        position={[-center.x, -center.y, -center.z]}
        scale={gameState === "selection" ? [0.3, 0.3, 0.3] : [0.25, 0.25, 0.25]}
        {...bind()}
      >
        <group position={[0, 0, -0.01]} rotation={[0, 0, 0.9]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Solid.geometry}
            material={
              tapCount >= 10
                ? new MeshStandardMaterial({
                    color: "#d4af37",
                    roughness: 0,
                    metalness: 1,
                  })
                : materials.White
            }
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Solid_1.geometry}
            material={
              tapCount >= 10
                ? new MeshStandardMaterial({
                    color: "#E2BF36",
                    roughness: 0,
                    metalness: 1,
                  })
                : materials.Black
            }
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Solid_2.geometry}
            material={materials.Stiches}
          />

          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Curve.geometry}
            material={materials.White}
            position={[-0.65194738, 1.03521895, 0]}
            rotation={[0, Math.PI / 2, 0]}
            scale={0.37675896}
          />
        </group>
      </group>
    </>
  );
}
useGLTF.preload("../models/Football.glb");
export default React.memo(Model);
