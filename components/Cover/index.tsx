import Marquee from "react-fast-marquee";
import { useEffect, useState, useContext, memo } from "react";
import BallGame from "../BallGame";
import GameContext from "@/context";
import LeftArrow from "../LeftArrow";
import Model from "../Model";
import BlackBallModel from "../BlackBallModel";
import BallSelection from "../BallSelection";
import Play from "../Play";

const Cover = () => {
  const [selectedBallIndex, setSelectedBallIndex] = useState(0);
  const { gameState, setGameState, setBallSelection } = useContext(GameContext);

  const balls = [
    { component: Model, position: [0, 0, 0] },
    { component: BlackBallModel, position: [0, 0, 0] },
  ];

  const Home: React.FC = () => {
    const [showContent, setShowContent] = useState(false);
    const [showMarquee, setShowMarquee] = useState(false);

    useEffect(() => {
      const fadeInTimeout = setTimeout(() => {
        setShowContent(true);
      }, 1000); // adjust this value as needed for the desired fade-in duration
      const marqueeTimeout = setTimeout(() => {
        setShowMarquee(true);
      }, 1000); // adjust this value as needed for the desired slide-up duration

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
          className={`font-GroteskRegular text-white uppercase text-7xl leading-[3.9rem] py-4 fixed top-14 overflow-hidden ${
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
          className={`w-full fixed bottom-[-100%] left-0 right-0 z-[101] ${
            showMarquee ? "marquee-show-animation duration-500 ease-out" : ""
          }`}
          onClick={handleScreenTap}
        >
          <Marquee
            className="bg-[#2c2c2c] text-white font-GroteskRegular uppercase py-3"
            gradient={false}
            speed={30}
            delay={1}
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
        <div onClick={handleScreenTap}></div>
        <BallGame />
      </>
    );
  };
  interface SelectionProps {
    selectedBallIndex: number;
    setSelectedBallIndex: (index: number) => void;
  }

  const Selection: React.FC<SelectionProps> = ({
    selectedBallIndex,
    setSelectedBallIndex,
  }) => {
    const [showContent, setShowContent] = useState(false);
    const [showMarquee, setShowMarquee] = useState(false);

    useEffect(() => {
      const fadeInTimeout = setTimeout(() => {
        setShowContent(true);
      }, 0); // adjust this value as needed for the desired fade-in duration

      return () => {
        clearTimeout(fadeInTimeout);
      };
    }, []);

    const Header = memo(({ text }) => {
      return (
        <div
          className={`font-GroteskRegular text-white uppercase text-6xl leading-[3.9rem] py-4 fixed top-14 overflow-hidden ${
            text
              ? "opacity-100 transition-opacity duration-500 ease-in"
              : "opacity-0"
          }`}
        >
          {text.split("\n").map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      );
    });

    const PlayButton = memo(({ onClick }) => {
      return (
        <div className="w-full fixed bottom-4 left-0 right-0 px-4 z-[101] opacity-100 transition-opacity duration-500 ease-in">
          <button
            className="relative uppercase text-white font-GroteskRegular text-2xl bg-[#C97900] w-full flex flex-row items-center justify-center py-2 rounded-md"
            onClick={onClick}
          >
            Play <LeftArrow />
          </button>
        </div>
      );
    });

    return (
      <>
        <Header text="Pick Your Poison" />
        <PlayButton onClick={handlePlayTap} />
        <BallSelection
          selectedBallIndex={selectedBallIndex}
          setSelectedBallIndex={setSelectedBallIndex}
          balls={balls}
        />
      </>
    );
  };
  interface GameplayProps {
    selectedBallIndex: number;
  }

  const Gameplay: React.FC = ({ selectedBallIndex }) => {
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
          className={`font-GroteskRegular text-white uppercase text-6xl leading-[3.9rem] py-4 fixed top-14 overflow-hidden ${
            showContent
              ? "opacity-100 transition-opacity duration-1000 ease-in"
              : "opacity-0"
          }`}
        >
          <div>Don&apos;t Let</div>
          <div>It Drop</div>
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
        <Play selectedBallIndex={selectedBallIndex} />
      </>
    );
  };

  const handleScreenTap = () => {
    setGameState("selection");
  };

  const handlePlayTap = () => {
    setBallSelection(balls[selectedBallIndex]);
    setGameState("gameplay");
  };

  // Calculate model position based on gameState

  return (
    <div>
      {gameState === "home" && <Home />}
      {gameState === "selection" && (
        <Selection
          selectedBallIndex={selectedBallIndex}
          setSelectedBallIndex={setSelectedBallIndex}
        />
      )}
      {gameState === "gameplay" && (
        <Gameplay selectedBallIndex={selectedBallIndex} />
      )}
    </div>
  );
};

export default Cover;
