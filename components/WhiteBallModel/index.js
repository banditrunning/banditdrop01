import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import { useSphere } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";

const WhiteBallModel = ({ onCollide, ...props }) => {
  const { nodes, materials } = useGLTF("../models/Football.glb");

  useFrame(({ scene }) => {
    if (ref.current) {
      // Update the mesh rotation to match the physics body rotation
      ref.current.rotation.copy(ref.current.children[0].quaternion);
    }
  });

  // Calculate the bounding box of the mesh
  const box = new Box3().setFromObject(nodes.Solid);

  // Calculate the size of the bounding box
  const size = new Vector3();
  box.getSize(size);

  // Calculate the center of the bounding box
  const center = new Vector3();
  box.getCenter(center);

  // Add physics to the model
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: [0, 5, 0],
    args: [size.length() / 2],
    material: { restitution: 1 },
    ...props,
  }));

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
          material={materials.White}
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
export default WhiteBallModel;
