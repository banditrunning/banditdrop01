import React, { useState, useEffect } from "react";
import Header from "../Header";

export default function Layout(props: { children: any }) {
  const { children } = props;
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fadeInTimeout = setTimeout(() => {
      setShowContent(true);
    }, 1000); // adjust this value as needed for the desired fade-in duration

    return () => clearTimeout(fadeInTimeout);
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative mx-4 m-auto fixed top-0 bottom-0">
      <Header showContent={showContent} />
      <main className="flex-1 flex flex-col fixed top-0 bottom-0 left-0 right-0">
        {children}
      </main>
    </div>
  );
}
