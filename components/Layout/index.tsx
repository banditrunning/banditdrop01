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
    <div className="flex flex-col min-h-screen relative mx-4 m-auto">
      <Header showContent={showContent} />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
