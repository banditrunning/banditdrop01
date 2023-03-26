import React, { useState, useEffect, useContext } from "react";
import { createClient } from "@supabase/supabase-js";
import LeftArrow from "../LeftArrow";
import GraphemeSplitter from "grapheme-splitter";
import Link from "next/link";
import GameContext from "@/context";

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
  setGameOver?: any;
  setTapCount?: any;
};
type ScoreProps = {
  score: number;
  gameOver?: boolean;
  highScorer: string;
};
type CounterProps = {
  tapCount: number;
  score: number;
  gameOver?: boolean;
  title?: string;
  name?: string;
  highScore?: string;
  setGameOver?: any;
  setTapCount?: any;
};

const YouBoard = ({
  tapCount,
  title,
  gameOver,
  score,
  setGameOver,
  setTapCount,
}: YouProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false); // added state for submitted
  const [scoreCount, setScoreCount] = useState(tapCount);
  const [emailError, setEmailError] = useState("");
  const { setGameState } = useContext(GameContext);

  const handleSaveScore = async () => {
    console.log("handleSaveScore called");
    setSubmitting(true);
    if (email.trim() === "") {
      setEmailError("ENTER A VALID EMAIL");
      setSubmitting(false);
      return;
    }
    const emailRegex = /\S+@\S+\.\S+/; // regex to match email format
    if (!emailRegex.test(email)) {
      setEmailError("ENTER A VALID EMAIL");
      setSubmitting(false);
      return;
    }
    const { data, error } = await supabase
      .from("scores")
      .insert([{ name: name, email: email, tapCount: scoreCount }]);
    setSubmitting(false);
    if (error) {
      console.error(error);
    } else {
      console.log(data);
      setSubmitted(true);
    }
  };

  const handleButtonClick = () => {
    setGameOver(false); // call setGameOver function passed from parent
    setTapCount(0);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setError(e.target.value.trim() === "");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailRegex = /\S+@\S+\.\S+/; // regex to match email format
    const email = e.target.value.trim();
    setEmail(email);
  };

  const isNameEmpty = name.trim() === "" || name.trim() === "YOUR INITALS*";
  const isEmailEmpty = email.trim() === "" || email.trim() === "YOUR EMAIL*";

  return (
    <>
      {gameOver === true ? (
        <>
          <div className="z-[101] relative left-0 right-0">
            <div
              className={`w-full flex flex-col items-center justify between w-full ${
                scoreCount >= 10 ? "bg-[#C97900]" : "bg-[#808080]"
              } rounded-md p-2`}
            >
              <div className="w-full rounded-md p-2 flex flex-col">
                <div className="flex flex-row items-center justify-between  pb-2">
                  <div
                    className={`text-lg ${
                      scoreCount >= 10 ? "text-black" : "bg-none text-white"
                    } uppercase font-GroteskMedium`}
                  >
                    {title}
                  </div>
                  {submitted && (
                    <Link href={"../Leaderboard"}>
                      <div className="text-sm text-[#C97900] font-GroteskRegular bg-black uppercase font-GroteskMedium flex flex-row items-center justify-between rounded-[2px] px-2 active:opacity:75">
                        VIEW SCOREBOARD <LeftArrow size={14} color="#C97900" />
                      </div>
                    </Link>
                  )}
                </div>
                <div
                  className={`${
                    scoreCount >= 10 ? "bg-[#C9C3AD]" : "bg-white"
                  } text-black font-GroteskRegular rounded-[5px] px-1 text-7xl rounded-[5px]`}
                >
                  {gameOver ? scoreCount : tapCount}
                </div>
              </div>
              {scoreCount >= 10 && (
                <div className="w-full flex flex-col justify-center items-center px-2 m-auto">
                  {!submitted ? (
                    <input
                      required
                      type="text"
                      placeholder="YOUR INITIALS*"
                      value={!submitted ? name : "SCORE RECORDED"}
                      onChange={handleNameChange}
                      onFocus={handleFocus}
                      maxLength={3}
                      onBlur={handleBlur}
                      className={`text-2xl placeholder-black ${
                        scoreCount >= 10 ? "bg-[#C9C3AD]" : "bg-white"
                      } rounded-[5px] px-2 py-2 mb-2 w-full uppercase ${
                        error ? "text-red-600" : "text-black"
                      } ${submitted && "text-[#C97900] pointer-events-none"}`}
                    />
                  ) : (
                    ""
                  )}
                  {!submitted ? (
                    <input
                      required
                      type="text"
                      placeholder="YOUR EMAIL*"
                      value={!submitted ? email : "SCORE RECORDED"}
                      onChange={handleEmailChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      className={`text-2xl placeholder-black ${
                        scoreCount >= 10 ? "bg-[#C9C3AD]" : "bg-white"
                      } rounded-[5px] px-2 py-2 w-full uppercase ${
                        emailError || isEmailEmpty ? "text-black" : "text-black"
                      } ${submitted && "text-[#C97900] pointer-events-none"}`}
                    />
                  ) : (
                    ""
                  )}

                  {emailError && (
                    <div className="pt-2 text-black">{emailError}</div>
                  )}

                  {tapCount >= 10 && (
                    <button
                      onClick={handleSaveScore}
                      disabled={isNameEmpty || submitting} // disable button if name is empty or submitting
                      className={`bg-white border border-white border-solid text-black font-GroteskRegular text-xl w-full rounded-[5px] my-2  py-2 flex flex-row justify-center items-center ${
                        error || submitting
                          ? "opacity-50 pointer-events-none"
                          : "opacity-100"
                      }`}
                    >
                      {!submitted ? (
                        <span className="mr-1 font-GroteskMedium">
                          SUBMIT SCORE
                        </span>
                      ) : (
                        <a
                          href="https://banditrunning.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-black font-GroteskRegular ${
                            submitted ? "" : "py-2"
                          } text-xl w-full rounded-[5px] flex flex-row justify-center items-center`}
                        >
                          <span className="mr-1">SHOP THE DROP</span>{" "}
                          <LeftArrow color="black" />
                        </a>
                      )}
                      {!submitted && <LeftArrow color="black" />}
                    </button>
                  )}
                </div>
              )}
            </div>
            {scoreCount < 10 && (
              <button
                onClick={handleButtonClick}
                className="border border-white border-solid text-white font-GroteskRegular text-xl px-4 w-full rounded-[5px] my-2 flex flex-row justify-center items-center"
              >
                <span className="mr-1 py-2">PLAY AGAIN</span> <LeftArrow />
              </button>
            )}
          </div>
        </>
      ) : (
        <div
          className={`${
            tapCount >= 10 ? "bg-[#C97900]" : "bg-[#808080]"
          } w-full rounded-md p-2 flex flex-col mr-1`}
        >
          <div className="text-lg text-black pb-2 uppercase font-GroteskMedium">
            {title}
          </div>
          <div
            className={`${
              tapCount >= 10 ? "bg-[#C9C3AD]" : "bg-white"
            } text-black font-GroteskRegular rounded-[5px] px-1 text-4xl`}
          >
            {gameOver ? (
              <span>
                {scoreCount}
                {scoreCount < 10 && <span className="text-[#c7c7c7]">/10</span>}
              </span>
            ) : (
              <>
                <span>
                  {tapCount}
                  {tapCount < 10 && <span className="text-[#c7c7c7]">/10</span>}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const HighScore = ({ score, highScorer }: ScoreProps) => {
  const splitter = new GraphemeSplitter();
  const graphemes = splitter.splitGraphemes(highScorer);
  const truncatedScorer =
    highScorer && graphemes.length > 3
      ? `${graphemes.slice(0, 4).join("")}...`
      : highScorer;

  return (
    <div className="w-full bg-[#BF3E2B] rounded-md p-2 flex flex-col ml-1">
      <div className="text-lg text-black pb-2 uppercase font-GroteskMedium">
        High Score
      </div>
      <div className="text-4xl text-black font-GroteskRegular bg-[#C4A6A8] rounded-[5px] px-1 flex flex-row items-center justify-between">
        {score ?? 0}
        <span className="text-lg bg-[#BF3E2B] text-white rounded-[5px] px-2 py-1 opacity-50">
          {truncatedScorer}
        </span>
      </div>
    </div>
  );
};
const CounterBoard = ({
  tapCount,
  score,
  gameOver,
  title,
  setGameOver,
  setTapCount,
}: CounterProps) => {
  const [highScore, setHighScore] = useState(0);
  const [highScorer, setHighScorer] = useState("");

  const getHighScore = async () => {
    const { data, error } = await supabase
      .from("scores")
      .select("name, tapCount")
      .order("tapCount", { ascending: false })
      .limit(1);

    if (error) {
      console.error(error);
    } else {
      setHighScore(data?.[0]?.tapCount || null);
      setHighScorer(data?.[0]?.name || null);
    }
  };

  useEffect(() => {
    getHighScore();
  }, []);

  return (
    <>
      {gameOver === false ? (
        <div className="w-full flex flex-row justify-between items-center m-auto w-full">
          <YouBoard
            tapCount={tapCount}
            title="You"
            gameOver={gameOver}
            setGameOver={setGameOver}
            setTapCount={setTapCount}
          />
          <HighScore score={highScore} highScorer={highScorer} />
        </div>
      ) : (
        <YouBoard
          tapCount={tapCount}
          title="Final Score"
          gameOver={gameOver}
          setGameOver={setGameOver}
          setTapCount={setTapCount}
        />
      )}
    </>
  );
};
export default CounterBoard;
