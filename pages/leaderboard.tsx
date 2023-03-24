import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

type Score = {
  name: string;
  tapCount: number;
};

const Leaderboard = () => {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      const { data: scores, error } = await supabase
        .from("scores")
        .select("name, tapCount")
        .order("tapCount", { ascending: false })
        .limit(10);
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

  return (
    <div
      className={`w-full font-GroteskBold text-white uppercase text-3xl py-4 fixed top-12 right-0 left-0 ${
        showContent
          ? "opacity-100 transition-opacity duration-1000 ease-in"
          : "opacity-0"
      }`}
    >
      <div className="w-full">
        {scores.map((score, index) => (
          <div
            key={score.name}
            className="w-full border-b border-solid border-gray-600 py-4 px-4"
          >
            <div className="w-full flex flex-row items-center justify-between">
              <span>{score.name}</span>
              <span>{score.tapCount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
