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
      gameOver?: boolean;
    }>;
    position: [number, number, number];
    clickable?: boolean;
    tapCount?: number;
    setTapCount?: React.Dispatch<React.SetStateAction<number>>;
    rotation?: [number, number, number];
    tapHandler?: () => void;
    gameOver?: boolean;
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
        gameOver,
      }) => (
        <Model
          position={position}
          onCollide={onCollide}
          clickable={clickable}
          tapCount={tapCount}
          setTapCount={setTapCount}
          rotation={rotation}
          tapHandler={tapHandler}
          gameOver={gameOver}
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
        gameOver,
      }) => (
        <BlackBallModel
          position={position}
          onCollide={onCollide}
          clickable={clickable}
          tapCount={tapCount}
          setTapCount={setTapCount}
          rotation={rotation}
          tapHandler={tapHandler}
          gameOver={gameOver}
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
        TAP TO PLAY
        <LeftArrow />
      </span>
    );
    return (
      <>
        <div
          className={`font-GroteskRegular text-white uppercase text-7xl md:text-9xl leading-[3.9rem] pt-4 fixed top-14 overflow-hidden px-4 z-[100000] md:z-[10000] ${
            showContent
              ? "opacity-100 transition-opacity duration-1000 ease-in"
              : "opacity-0"
          }`}
        >
          <div className="max-w-lg leading-[.9em]">How&apos;s Your Touch?</div>
          <div className="py-3 font-GroteskRegular text-white uppercase text-[24px] leading-[1.5rem] tracking-[1px]">
            <div className="text-[#ffffff] mb-1 md:text-3xl md:leading-[2rem]">
              Get 10 juggles, Unlock the drop
            </div>
            <div className="text-[#767676] max-w-[290px] md:max-w-lg md:text-3xl md:leading-[2rem]">
              High score Sunday 11:59pm est wins one of everything
            </div>
          </div>
        </div>
        <div
          className={`w-full fixed bottom-[-100%] left-0 right-0 z-[10000] ${
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
        <div className="z-[10000]">
          <BallGame />
        </div>
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
          className={`font-GroteskRegular text-white uppercase text-6xl md:text-9xl leading-[3.9rem] py-4 fixed top-14 overflow-hidden px-4 ${
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
        <Header text="CHOOSE YOUR SIDE" />
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
        TAP TO PLAY <LeftArrow />
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
    <div className="">
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
