import React, { useState, useEffect, useContext } from "react";
import { createClient } from "@supabase/supabase-js";
import GameContext from "@/context";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

type Score = {
  name: string;
  tapCount: number;
  created_at: string;
};

const LeaderboardPanel = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const { gameState, setGameState } = useContext(GameContext);

  setGameState("leaderboard");

  useEffect(() => {
    const fetchScores = async () => {
      const { data: scores, error } = await supabase
        .from("scores")
        .select("name, tapCount, created_at")
        .order("tapCount", { ascending: false })
        .limit(15);
      if (error) {
        console.error(error);
      } else {
        setScores(scores || []);
      }
    };
    fetchScores();
  }, []);

  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fadeInTimeout = setTimeout(() => {
      setShowContent(true);
    }, 1000); // adjust this value as needed for the desired fade-in duration

    return () => {
      clearTimeout(fadeInTimeout);
    };
  }, []);

  const timeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  };

  return (
    <div
      className={`w-full text-white uppercase text-3xl py-4 fixed top-12 right-0 left-0 overflow-y-scroll h-full ${
        showContent
          ? "opacity-100 transition-opacity duration-1000 ease-in"
          : "opacity-0"
      }`}
      style={{
        background: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))",
      }}
    >
      <div className="w-full overflow-scroll z-[102]">
        {scores.map((score, index) => (
          <div
            key={score.name}
            className="w-full border-b border-solid border-gray-600 py-2 px-4"
          >
            <div className="w-full flex flex-row items-center justify-between">
              <span className="font-GroteskRegular">{score.name}</span>
              <span className="font-GroteskRegular">{score.tapCount}</span>
            </div>
            <div className="text-sm text-[#676769] font-GroteskMedium">
              {timeSince(new Date(score.created_at))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default LeaderboardPanel;
