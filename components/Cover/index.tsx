import Marquee from "react-fast-marquee";
import { useEffect, useState, useContext } from "react";
import BallGame from "../BallGame";
import GameContext from "@/context";
import LeftArrow from "../LeftArrow";

const Cover = () => {
  const Home = () => {
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

    const MarqueeMessage = () => (
      <span className="px-2 flex flex-row justify-between items-center text-2xl">
        TAP TO START <LeftArrow />
      </span>
    );
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
        <BallGame onClick={handleScreenTap} />
      </>
    );
  };

  const Selection = () => {
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

    const MarqueeMessage = () => (
      <span className="px-2 flex flex-row justify-between items-center text-2xl">
        TAP TO START <LeftArrow />
      </span>
    );
    return (
      <>
        <div
          className={`font-GroteskRegular text-white uppercase text-7xl leading-[3.9rem] py-4 ${
            showContent
              ? "opacity-100 transition-opacity duration-1000 ease-in"
              : "opacity-0"
          }`}
        >
          <div>Pick</div>
          <div>Your</div>
          <div>Poison</div>
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

  const Gameplay = () => {
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

    const MarqueeMessage = () => (
      <span className="px-2 flex flex-row justify-between items-center text-2xl">
        TAP TO START <LeftArrow />
      </span>
    );
    return (
      <>
        <div
          className={`font-GroteskRegular text-white uppercase text-7xl leading-[3.9rem] py-4 ${
            showContent
              ? "opacity-100 transition-opacity duration-1000 ease-in"
              : "opacity-0"
          }`}
        >
          <div>Don&apos;t</div>
          <div>Let It</div>
          <div>Drop</div>
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

  const { gameState, setGameState } = useContext(GameContext);

  const handleScreenTap = () => {
    setGameState("selection");
  };

  if (gameState === "home") {
    return <Home />;
  } else if (gameState === "selection") {
    return <Selection />;
  } else if (gameState === "gameplay") {
    return <Gameplay />;
  } else {
    return <div>Error: Invalid app state</div>;
  }
};

export default Cover;
