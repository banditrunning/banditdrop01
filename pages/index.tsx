import { useMediaQuery } from "@react-hook/media-query";
import Cover from "@/components/Cover";
import LeaderboardPanel from "@/components/LeaderboardPanel";

export default function Home() {
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <div>
      {isMobile ? (
        <Cover />
      ) : (
        <div>
          <LeaderboardPanel />
        </div>
      )}
    </div>
  );
}
