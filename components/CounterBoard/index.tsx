import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import LeftArrow from "../LeftArrow";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

const handleFocus = () => {
  document.body.classList.add("scroll-lock");
};

const handleBlur = () => {
  document.body.classList.remove("scroll-lock");
};

type YouProps = {
  tapCount: number;
  title: string;
  gameOver?: boolean;
  score?: number;
};
type ScoreProps = {
  score: number;
  gameOver?: boolean;
};
type CounterProps = {
  tapCount: number;
  score: number;
  gameOver?: boolean;
  title?: string;
  name?: string;
};

const YouBoard = ({ tapCount, title, gameOver, score }: YouProps) => {
  const [name, setName] = useState("");

  const handleSaveScore = async () => {
    console.log("handleSaveScore called");
    const { data, error } = await supabase
      .from("scores")
      .insert([{ name: name, tapCount: tapCount }]);
    if (error) {
      console.error(error);
    } else {
      console.log(data);
    }
  };
  return (
    <>
      {gameOver === true ? (
        <>
          <div className="z-[101] relative left-0 right-0">
            <div className="w-full flex flex-col items-center justify between w-full bg-[#C97900] rounded-md p-2">
              <div className="w-full bg-[#C97900] rounded-md p-2 flex flex-col">
                <div className="text-lg text-black pb-2 uppercase font-GroteskMedium">
                  {title}
                </div>
                <div className="text-black font-GroteskRegular bg-[#C9C3AD] rounded-sm px-1 text-7xl rounded-[5px]">
                  {tapCount}
                </div>
              </div>
              <div className="w-full flex flex-col justify-center items-center px-2 m-auto">
                <input
                  type="text"
                  placeholder="YOUR NAME"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className="text-3xl text-black placeholder-black font-GroteskRegular bg-[#C9C3AD] rounded-[5px] px-2 py-2 mb-2 w-full uppercase"
                />
              </div>
            </div>
            <button
              onClick={handleSaveScore}
              className="border border-white border-solid text-white font-GroteskRegular py-2 text-xl px-4 w-full rounded-[5px] my-2 flex flex-row justify-center items-center"
            >
              <span className="mr-1">SHOP THE DROP</span> <LeftArrow />
            </button>
          </div>
        </>
      ) : (
        <div className="w-full bg-[#C97900] rounded-md p-2 flex flex-col mr-1">
          <div className="text-lg text-black pb-2 uppercase font-GroteskMedium">
            {title}
          </div>
          <div className="text-black font-GroteskRegular bg-[#C9C3AD] rounded-sm px-1 text-4xl">
            {tapCount}
          </div>
        </div>
      )}
    </>
  );
};

const HighScore = ({ score }: ScoreProps) => {
  return (
    <div className="w-full bg-[#BF3E2B] rounded-md p-2 flex flex-col ml-1">
      <div className="text-lg text-black pb-2 uppercase font-GroteskMedium">
        High Score
      </div>
      <div className="text-4xl text-black font-GroteskRegular bg-[#C4A6A8] rounded-sm px-1">
        {score ?? 0}
      </div>
    </div>
  );
};

const CounterBoard = ({ tapCount, score, gameOver, title }: CounterProps) => {
  const [highScore, setHighScore] = useState(null);

  const getHighScore = async () => {
    const { data, error } = await supabase
      .from("scores")
      .select("tapCount")
      .order("tapCount", { ascending: false })
      .limit(1);

    if (error) {
      console.error(error);
    } else {
      setHighScore(data?.[0]?.tapCount || null);
    }
  };

  useEffect(() => {
    getHighScore();
  }, []);
  return (
    <>
      {gameOver === false ? (
        <div className="w-full flex flex-row justify-between items-center m-auto></w-full">
          <YouBoard tapCount={tapCount} title="You" gameOver={gameOver} />
          <HighScore score={highScore} />
        </div>
      ) : (
        <YouBoard tapCount={tapCount} title="Final Score" gameOver={gameOver} />
      )}
    </>
  );
};
export default CounterBoard;
