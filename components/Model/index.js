import React, { useRef, useEffect, useContext } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import { useSphere } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import GameContext from "@/context";

const Model = ({ position, onCollide, ...props }) => {
  const { gameState } = useContext(GameContext);
  const { nodes, materials } = useGLTF("../models/Football.glb");

  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: position,
    args: [size.length() / 2],
    material: { restitution: 1.2 },
    ...props,
  }));

  useFrame(({ scene }) => {
    if (ref.current) {
      // Update the mesh rotation to match the physics body rotation
      ref.current.rotation.copy(ref.current.children[0].quaternion);
    }
  });

  useEffect(() => {
    if (gameState === "selection") {
      api.position.set(0, 0, 0);
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 1, 0);
      api.mass.set(0);
    } else if (gameState === "home") {
      api.position.set(0, 3, 0);
      api.velocity.set(0, 1, 0);
      api.rotation.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
      api.mass.set(1);
    }
  }, [gameState, api]);

  const targetPosition = useRef(new Vector3(...position));

  // Calculate the bounding box of the mesh
  const box = new Box3().setFromObject(nodes.Solid);

  // Calculate the size of the bounding box
  const size = new Vector3();
  box.getSize(size);

  // Calculate the center of the bounding box
  const center = new Vector3();
  box.getCenter(center);

  // Add physics to the model

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

  return (
    <group
      ref={ref}
      dispose={null}
      position={[-center.x, -center.y, -center.z]}
      scale={[0.3, 0.3, 0.3]}
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
};

useGLTF.preload("../models/Football.glb");
export default Model;
