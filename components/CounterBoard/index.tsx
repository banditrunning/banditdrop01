import React from "react";

type YouProps = {
  tapCount: number;
};
type ScoreProps = {
  score: number;
};
type CounterProps = {
  tapCount: number;
  score: number;
};

const YouBoard = ({ tapCount }: YouProps) => {
  return (
    <div className="w-full bg-[#C97900] rounded-md p-2 flex flex-col mr-1">
      <div className="text-sm text-black pb-1">You</div>
      <div className="text-4xl text-black font-GroteskRegular bg-[#C9C3AD] rounded-sm px-1">
        {tapCount.toString().padStart(4, "0")}
      </div>
    </div>
  );
};

const HighScore = ({ score }: ScoreProps) => {
  return (
    <div className="w-full bg-[#BF3E2B] rounded-md p-2 flex flex-col ml-1">
      <div className="text-sm text-black pb-1">High Score</div>
      <div className="text-4xl text-black font-GroteskRegular bg-[#C4A6A8] rounded-sm px-1">
        {score.toString().padStart(4, "0")}
      </div>
    </div>
  );
};

const CounterBoard = ({ tapCount }: CounterProps) => {
  return (
    <div className="w-full flex flex-row justify-between items-center m-auto">
      <YouBoard tapCount={tapCount} />
      <HighScore score={0} />
    </div>
  );
};

export default CounterBoard;
