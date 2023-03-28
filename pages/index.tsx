import { useMediaQuery } from "@react-hook/media-query";
import Cover from "@/components/Cover";
import LeaderboardPanel from "@/components/LeaderboardPanel";
import Head from "next/head";

export default function Home() {
  return (
    <body>
      <Head>
        <title>Bandit RC</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Get 10 juggles, unlock the Bandit RC drop."
        />
        <meta property="og:title" content="Bandit RC" />
        <meta
          property="og:description"
          content="Get 10 juggles, unlock the Bandit RC drop."
        />
        <meta
          property="og:image"
          content="https://raw.githubusercontent.com/tlcottr/portfolio/main/img/sharecard.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bandit RC" />
        <meta
          name="twitter:description"
          content="Get 10 juggles, unlock the Bandit RC drop."
        />
        <meta
          name="twitter:image"
          content="https://raw.githubusercontent.com/tlcottr/portfolio/main/img/sharecard.png"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Cover />
      </div>
    </body>
  );
}
