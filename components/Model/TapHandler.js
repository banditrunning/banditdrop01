import { useFrame } from "@react-three/fiber";
import { useState, useEffect, useRef } from "react";
import { Vector3 } from "three";

const TapHandler = ({ api }) => {
  const [tapping, setTapping] = useState(false);
  const [tapStartTime, setTapStartTime] = useState(null);
  const [tapStartPosition, setTapStartPosition] = useState([0, 0]);
  const [tapEndPosition, setTapEndPosition] = useState([0, 0]);
  const [tapForce, setTapForce] = useState([0, 0, 0]);
  const [tapTorque, setTapTorque] = useState([0, 0, 0]);
  const [isAirborne, setIsAirborne] = useState(false);

  const velocity = useRef([0, 0, 0]);

  useEffect(() => {
    const onPointerDown = (event) => {
      event.preventDefault();
      setTapping(true);
      setTapStartTime(performance.now());
      setTapStartPosition([event.clientX, event.clientY]);
    };

    const onPointerUp = (event) => {
      event.preventDefault();
      setTapping(false);
      setTapEndPosition([event.clientX, event.clientY]);

      // Calculate the force to apply to the ball
      const diffX = tapEndPosition[0] - tapStartPosition[0];
      const diffY = tapEndPosition[1] - tapStartPosition[1];
      const timeDiff = performance.now() - tapStartTime;
      const forceX = diffX / timeDiff;
      const forceY = diffY / timeDiff;
      const forceZ =
        Math.min(Math.max(Math.abs(forceX), Math.abs(forceY)), 10) * -100;
      setTapForce([forceX, forceY, forceZ]);

      // Calculate the torque to apply to the ball
      const torqueX = -forceY * 10;
      const torqueY = forceX * 10;
      const torqueZ = 0;
      setTapTorque([torqueX, torqueY, torqueZ]);
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [tapEndPosition, tapStartPosition, tapStartTime]);

  useFrame(() => {
    if (api.current) {
      const ballPosition = api.current.position;
      const ballVelocity = api.current.velocity;

      // Determine if the ball is airborne
      setIsAirborne(ballPosition.y > 0.5);

      // Apply the tap force and torque to the ball
      if (tapping && isAirborne) {
        applyForce(api.current, tapForce, ballPosition);
        applyTorque(api.current, tapTorque);
      }

      // Update the velocity ref
      velocity.current = ballVelocity;
    }
  });

  return null;
};

export default TapHandler;
