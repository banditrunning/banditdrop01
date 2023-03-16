// useCustomSphere.js
import { useRef, useEffect } from "react";
import { useSphere } from "@react-three/cannon";

export const useCustomSphere = (propsFn) => {
  const ref = useRef();
  const [sphereRef, api] = useSphere(() => {
    const props = propsFn();
    ref.current = props.object3d;
    return props;
  });

  useEffect(() => {
    if (ref.current && sphereRef) {
      ref.current.children = sphereRef.children;
    }
  }, [ref, sphereRef]);

  return [ref, sphereRef, api];
};
