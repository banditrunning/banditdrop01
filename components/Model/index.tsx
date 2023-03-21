import React, { useRef, useEffect, useMemo, useContext } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import { useSphere, SphereProps } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import GameContext from "@/context";

interface ModelProps {
  position: [number, number, number];
  onCollide?: (e: any, child: any) => void;
  clickable?: boolean;
}

const Model: React.FC<ModelProps> = ({ position, onCollide, clickable }) => {
  const { gameState } = useContext(GameContext);
  const { nodes, materials } = useGLTF("../models/Football.glb");

  const [ref, api] = useSphere<SphereProps>(() => ({
    mass: 1,
    position: position,
    args: [size.length() / 2],
    material: { restitution: 1.2 },
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

  const targetPosition = useRef<Vector3>(new Vector3(...position));

  // Calculate the bounding box of the mesh
  const box = useMemo<Box3>(
    () => new Box3().setFromObject(nodes.Solid),
    [nodes.Solid]
  );

  // Calculate the size of the bounding box
  const size = useMemo<Vector3>(() => new Vector3(), []);

  box.getSize(size);

  // Calculate the center of the bounding box
  const center = useMemo<Vector3>(() => new Vector3(), []);

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

  function handleClick() {
    const upwardForce = [0, 100, 0];
    const worldPoint = [0, 0, 0];
    api.applyForce(upwardForce, worldPoint);
  }

  return (
    <group
      ref={ref}
      dispose={null}
      position={[-center.x, -center.y, -center.z]}
      scale={[0.3, 0.3, 0.3]}
      onClick={clickable ? handleClick : undefined}
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
