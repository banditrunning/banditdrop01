import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import GameContextProvider from "@/components/GameContextProvider";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GameContextProvider>
      <Layout>
        <Component {...pageProps} />;
        <Analytics />
      </Layout>
    </GameContextProvider>
  );
}
