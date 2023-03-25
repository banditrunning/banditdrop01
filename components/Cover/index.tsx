import Marquee from "react-fast-marquee";
import {
  useEffect,
  useState,
  useContext,
  memo,
  Key,
  ReactElement,
  ReactFragment,
  ReactPortal,
} from "react";
import BallGame from "../BallGame";
import GameContext from "@/context";
import LeftArrow from "../LeftArrow";
import Model from "../Model";
import BlackBallModel from "../BlackBallModel";
import BallSelection from "../BallSelection";
import Play from "../Play";

const Cover: React.FC = () => {
  const { selectedBallIndex, setSelectedBallIndex } = useContext(GameContext);
  const { gameState, setGameState, setBallSelection } = useContext(GameContext);

  interface Ball {
    component: React.FC<{
      position: [number, number, number];
      onCollide: () => void;
      clickable?: boolean;
      tapCount?: number;
      setTapCount?: React.Dispatch<React.SetStateAction<number>>;
      rotation: [number, number, number];
      tapHandler?: () => void;
    }>;
    position: [number, number, number];
    clickable?: boolean;
    tapCount?: number;
    setTapCount?: React.Dispatch<React.SetStateAction<number>>;
    rotation?: [number, number, number];
    tapHandler?: () => void;
  }

  const balls: Ball[] = [
    {
      component: ({
        position,
        onCollide,
        clickable,
        tapCount,
        setTapCount,
        rotation,
        tapHandler,
      }) => (
        <Model
          position={position}
          onCollide={onCollide}
          clickable={clickable}
          tapCount={tapCount}
          setTapCount={setTapCount}
          rotation={rotation}
          tapHandler={tapHandler}
        />
      ),
      position: [0, 0, 0],
      clickable: true,
      rotation: [0, 0, 0],
    },
    {
      component: ({
        position,
        onCollide,
        clickable,
        tapCount,
        setTapCount,
        rotation,
        tapHandler,
      }) => (
        <BlackBallModel
          position={position}
          onCollide={onCollide}
          clickable={clickable}
          tapCount={tapCount}
          setTapCount={setTapCount}
          rotation={rotation}
          tapHandler={tapHandler}
        />
      ),
      position: [0, 0, 0],
      clickable: true,
      rotation: [0, 0, 0],
    },
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
          className={`font-GroteskRegular text-white uppercase text-7xl leading-[3.9rem] py-4 fixed top-14 overflow-hidden px-4 ${
            showContent
              ? "opacity-100 transition-opacity duration-1000 ease-in"
              : "opacity-0"
          }`}
        >
          <div>How&apos;s</div>
          <div>Your</div>
          <div>Juggle?</div>
          <div className=" py-3 font-GroteskRegular text-white uppercase text-lg leading-[1.2rem] text-[#767676]">
            <div>Beat the High Score.</div>
            <div>Unlock early drop access.</div>
          </div>
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

    const Header = memo(function Header({ text }: { text: string }) {
      return (
        <div
          className={`font-GroteskRegular text-white uppercase text-6xl leading-[3.9rem] py-4 fixed top-14 overflow-hidden px-4 ${
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

    return (
      <>
        <Header text="Pick Your Poison" />
        <BallSelection balls={balls} rotation={[0, Math.PI / 2, 0]} />
      </>
    );
  };

  Selection.displayName = "Selection";

  interface GameplayProps {
    selectedBall: Ball;
  }

  const Gameplay: React.FC<GameplayProps> = ({ selectedBall }) => {
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
        <div className="font-GroteskRegular text-white uppercase text-6xl leading-[3.9rem] py-4 fixed top-14 overflow-hidden w-full"></div>

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
        <Play
          ball={selectedBall.component({
            position: [0, 0, 0],
            onCollide: () => {},
            rotation: [0, 0, 0],
          })}
        />
      </>
    );
  };
  const MemoizedGameplay = memo(Gameplay);
  Gameplay.displayName = "Gameplay";

  const handleScreenTap = () => {
    setGameState("selection");
  };

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
        <MemoizedGameplay selectedBall={balls[selectedBallIndex]} />
      )}
    </div>
  );
};

export default Cover;
