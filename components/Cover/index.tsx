import Marquee from "react-fast-marquee";
import { useEffect, useState } from "react";
import BallGame from "../BallGame";

const LeftArrow = () => (
  <svg
    width="20"
    height="19"
    viewBox="0 0 18 17"
    fill="none"
    className="rotate-180 pr-1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.52 0.175999H6.88C6.88 1.88 6.304 3.32 5.2 4.472C4.096 5.648 2.512 6.728 0.448 7.736V9.44C2.512 10.448 4.096 11.552 5.2 12.704C6.304 13.88 6.88 15.296 6.88 16.976H9.52C9.52 15.056 9.04 13.496 8.104 12.32C7.168 11.168 5.92 10.352 4.36 9.896V9.776H17.728V7.376H4.36V7.232C5.92 6.8 7.168 6.008 8.104 4.832C9.04 3.68 9.52 2.12 9.52 0.175999Z"
      fill="white"
    />
  </svg>
);

const MarqueeMessage = () => (
  <span className="px-2 flex flex-row justify-between items-center text-2xl">
    TAP TO START <LeftArrow />
  </span>
);

const Cover = () => {
  const [showContent, setShowContent] = useState(false);
  const [showMarquee, setShowMarquee] = useState(false);

  useEffect(() => {
    const fadeInTimeout = setTimeout(() => {
      setShowContent(true);
    }, 1000); // adjust this value as needed for the desired fade-in duration
    const marqueeTimeout = setTimeout(() => {
      setShowMarquee(true);
    }, 2000); // adjust this value as needed for the desired slide-up duration

    return () => {
      clearTimeout(fadeInTimeout);
      clearTimeout(marqueeTimeout);
    };
  }, []);

  return (
    <>
      <div
        className={`font-GroteskRegular text-white uppercase text-7xl leading-[3.9rem] py-4 ${
          showContent
            ? "opacity-100 transition-opacity duration-1000 ease-in"
            : "opacity-0"
        }`}
      >
        <div>How&apos;s</div>
        <div>Your</div>
        <div>Juggle?</div>
      </div>
      <div
        className={`w-full fixed bottom-[-100%] left-0 right-0 ${
          showMarquee ? "marquee-show-animation duration-1000 ease-out" : ""
        }`}
      >
        <Marquee
          className="bg-[#2c2c2c] text-white font-GroteskRegular uppercase py-3"
          gradient={false}
          speed={30}
          delay={3}
        >
          {Array(19)
            .fill(19, 0, 19)
            .map((_, index) => (
              <MarqueeMessage key={index} />
            ))}
        </Marquee>
      </div>
      <style jsx>{`
        .marquee-show-animation {
          animation: slide-up 1s ease-out forwards;
        }

        @keyframes slide-up {
          from {
            bottom: -100%;
          }
          to {
            bottom: 0;
          }
        }
      `}</style>
      <BallGame />
    </>
  );
};
export default Cover;
