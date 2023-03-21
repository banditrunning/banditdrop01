import React from "react";

type Props = {};

const YouBoard = (props: Props) => {
  return (
    <div className="w-full bg-[#C97900]">
      <div>You</div>
    </div>
  );
};

const HighScore = (props: Props) => {
  return (
    <div className="w-full bg-[#C97900]">
      <div>You</div>
    </div>
  );
};

const CounterBoard = (props: Props) => {
  return (
    <div className="w-full flex flex-row justify-between items-center m-auto">
      <YouBoard />
      <HighScore />
    </div>
  );
};

export default CounterBoard;
