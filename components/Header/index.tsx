import React from "react";
import Symbol from "../Symbol";

export default function Header(props: { showContent: boolean }) {
  const { showContent } = props;

  return (
    <div
      className={`flex flex-row w-full items-center justify-between border-b border-solid border-white pt-6 pb-4 ${
        showContent
          ? "opacity-100 transition-opacity duration-1000 ease-in"
          : "opacity-0"
      }`}
    >
      <Symbol />
    </div>
  );
}
