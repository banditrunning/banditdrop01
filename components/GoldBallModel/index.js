import React, { useRef, useEffect, useMemo, useContext, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3, MeshStandardMaterial } from "three";
import { useSphere } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import GameContext from "@/context";

const Model = ({ position, onCollide, clickable, ...props }) => {
  const { gameState } = useContext(GameContext);
  const { nodes, materials } = useGLTF("../models/Football.glb");

  const [ref, api] = useSphere(() => ({
    mass: gameState === "selection" ? 0 : 1,
    position: position,
    args: [size.length() / 2],
    material: { restitution: 1.2 },
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

  // Calculate the center of the bounding box
  const center = new Vector3();
  box.getCenter(center);

  useEffect(() => {
    targetPosition.current.set(...position);
  }, [position]);

  useEffect(() => {
    if (ref.current && onCollide) {
      ref.current.addEventListener("collide", (e) =>
        onCollide(e, ref.current.children[0])
      );
    }

    return () => {
      if (ref.current && onCollide) {
        ref.current.removeEventListener("collide", (e) =>
          onCollide(e, ref.current.children[0])
        );
      }
    };
  }, [ref, onCollide]);

  function handleTap() {
    const upwardForce = [0, 150, 0];
    const spinTorque = [0, inAir ? -10 : 0, 0]; // apply a torque around the y-axis if in air
    const worldPoint = [0, 0, 0];
    api.applyForce(upwardForce, worldPoint);
    api.applyTorque(spinTorque); // apply the torque
  }

  return (
    <group
      ref={ref}
      dispose={null}
      position={[-center.x, -center.y, -center.z]}
      scale={[0.3, 0.3, 0.3]}
      onPointerUp={clickable ? handleTap : null}
    >
      <group position={[0, 0, -0.01]} rotation={[-Math.PI, 0, -Math.PI]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Solid.geometry}
          material={
            new MeshStandardMaterial({
              color: "#39FF14",
              roughness: 0,
              metalness: 0.25,
            })
          }
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Solid_1.geometry}
          material={
            new MeshStandardMaterial({
              color: "#39FF14",
              roughness: 0,
              metalness: 0,
              emissive: "#39FF14",
              emissiveIntensity: 1,
            })
          }
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
};
useGLTF.preload("../models/Football.glb");
export default Model;
