import React, { useState, useEffect } from "react";
import Link from "next/link";

const Countdown = () => {
  const countdownDate = new Date("April 2, 2023 23:59:00").getTime();
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { days, hours, minutes, seconds } = timeRemaining;

  return (
    <>
      <Link href={"../leaderboard"}>
        <div className="flex items-center justify-center text-center bg-[#C97900] px-2 py-[0.5px] rounded-[5px]">
          <div className="">{days.toString().padStart(2, "0")}:</div>
          <div className="">{hours.toString().padStart(2, "0")}:</div>
          <div className="">{minutes.toString().padStart(2, "0")}:</div>
          <div>{seconds.toString().padStart(2, "0")};</div>
        </div>
      </Link>
    </>
  );
};

export default Countdown;
