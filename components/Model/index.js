import React, { useRef, useEffect, useMemo, useContext, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import { useSphere } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import GameContext from "@/context";
import { useGesture } from "react-use-gesture";
import { useSound } from "use-sound";
import kick from "public/sounds/kick.mp4";
import * as THREE from "three";

function Model({
  position,
  onCollide,
  clickable,
  tapCount,
  setTapCount,
  ...props
}) {
  const { gameState } = useContext(GameContext); // Access the gameState variable from context
  const { nodes, materials } = useGLTF("../models/Football.glb");
  const [playKickSound] = useSound(kick);

  const [ref, api] = useSphere((index) => ({
    mass: gameState === "selection" ? 0 : 1,
    position: position,
    args: [scaledBallRadius],
    material: { restitution: 1.2 },
    onCollide: (e) => {
      onCollide && onCollide(e, ref);
    },
    ...props,
  }));

  const [inAir, setInAir] = useState(false);

  useFrame(({ scene }) => {
    if (ref.current) {
      // Update the mesh rotation to match the physics body rotation

      // Check if the ball is in the air
      if (ref.current.position.y > 0) {
        setInAir(true);
      } else {
        setInAir(false);
      }
    }
  });

  const targetPosition = useRef(new Vector3(...position));

  // Calculate the bounding box of the mesh
  const box = new Box3().setFromObject(nodes.Solid);

  // Calculate the size of the bounding box
  const size = new Vector3();
  box.getSize(size);
  const ballRadius = size.length() / (2 * Math.sqrt(3));
  const scaledBallRadius = ballRadius * 0.3;

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

      return () => {
        ref.current.removeEventListener("collide", handleCollide);
      };
    }
  }, [ref, onCollide]);

  const bind = useGesture({
    onPointerUp: () => {
      const upwardForce = [0, 150, 0];
      const worldPoint = [0, 0, 0];

      if (api) {
        // check if api is defined
        api.applyForce(upwardForce, worldPoint);
        playKickSound(); // play the kick sound effect
      }

      // Increment the tap count and store it locally
      {
        gameState === "gameplay" && setTapCount(tapCount + 1);
      }

      {
        inAir === false;
        angularVelocity === [0, 0, 0];
      }
    },
  });

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
    }
  }, [api, angularVelocity]);

  return (
    <group
      ref={ref}
      dispose={null}
      position={[-center.x, -center.y, -center.z]}
      scale={[0.3, 0.3, 0.3]}
      {...bind()}
    >
      <group position={[0, 0, -0.01]} rotation={[-Math.PI, 0, -Math.PI]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Solid.geometry}
          material={materials.White}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Solid_1.geometry}
          material={materials.Black}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Solid_2.geometry}
          material={materials.Stiches}
        />
      </group>
    </group>
  );
}
useGLTF.preload("../models/Football.glb");
export default React.memo(Model);
