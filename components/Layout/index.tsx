import React, { useState, useEffect, useRef } from "react";
import Header from "../Header";

export default function Layout(props: { children: any }) {
  const { children } = props;
  const [showContent, setShowContent] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fadeInTimeout = setTimeout(() => {
      setShowContent(true);
    }, 1000); // adjust this value as needed for the desired fade-in duration

    return () => clearTimeout(fadeInTimeout);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        const cursorWidth = cursorRef.current.offsetWidth;
        const cursorHeight = cursorRef.current.offsetHeight;
        cursorRef.current.style.left = e.clientX - cursorWidth / 2 + "px";
        cursorRef.current.style.top = e.clientY - cursorHeight / 2 + "px";
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div className="relative">
      <div
        className="w-14 h-14 rounded-full bg-transparent md:bg-white absolute -top-4 -left-4 opacity-100 transition-opacity pointer-events-none cursor-none z-[100000]"
        ref={cursorRef}
        style={{ cursor: "none" }}
      ></div>
      <div className="flex flex-col min-h-screen relative mx-4 m-auto fixed top-0 bottom-0 overflow-hidden">
        <Header showContent={showContent} />
        <main className="flex-1 flex flex-col fixed top-0 bottom-0 left-0 right-0">
          {children}
        </main>
      </div>
    </div>
  );
}
