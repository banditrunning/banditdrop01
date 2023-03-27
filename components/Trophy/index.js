import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Model(props) {
  const { nodes, materials } = useGLTF("/trophy.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cupobj.geometry}
        material={
          new MeshStandardMaterial({
            color: "#E2BF36",
            roughness: 0,
            metalness: 1,
          })
        }
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

useGLTF.preload("/trophy.glb");
