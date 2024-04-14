import { useEffect, useState, useRef } from "react";
import "./css/Game.css";
import {
  youtube_playlistByIdType,
  youtube_videoStatisticsType,
} from "../types/youtube_types";
import { getPlaylistItemsById, getVideoStatistics } from "../hooks/useYoutube";
import TrackCard from "./components/TrackCard";
import { spotify_storeCredentials } from "../hooks/useSpotify";
import { generateRandomIndexInRange } from "../hooks/useRandomIndexGenerator";

export default function Game() {
  const youtube_00s_playlist = "PLcLtbK8Nf64InyudI1rnYwwRbCr08yup_";

  const [loading, setLoading] = useState(true);
  const [randomIndexes, setRandomIndexes] = useState<null | number[]>();
  const [tracks, setTracks] = useState<null | youtube_playlistByIdType[]>(null);
  const [score, setScore] = useState(0);

  const [A_Revealed, setA_Revealed] = useState(false);
  const [B_Revealed, setB_Revealed] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const { current: statistics } = useRef<{
    a: youtube_videoStatisticsType | undefined;
    b: youtube_videoStatisticsType | undefined;
  }>({ a: undefined, b: undefined });

  async function getStatistics(id: string) {
    try {
      const result = await getVideoStatistics(id);

      return result as youtube_videoStatisticsType;
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    (async () => {
      //stores the spotify access token
      await spotify_storeCredentials().then(() => setLoading(false));
    })();
  }, []);

  useEffect(() => {
    //gets items list from a youtube playlist by id
    (async () => {
      try {
        const items = await getPlaylistItemsById(youtube_00s_playlist);

        if (items === undefined) {
          throw new Error("failed to fetch the playlist items");
        }

        //remove deleted videos to prevent errors
        const clean_list = items.filter((item) => {
          if (item.snippet.title !== "Deleted video") {
            return item as youtube_playlistByIdType;
          }
        });

        setTracks(clean_list as youtube_playlistByIdType[]);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [loading]);

  //generate the indexes after we got the list of tracks
  useEffect(() => {
    if (!tracks) return;

    setRandomIndexes(generateRandomIndexInRange(tracks.length));
  }, [tracks]);

  useEffect(() => {
    if (!tracks) return;

    if (tracks.length <= 2) {
      alert("List Is to Short");
    }
  }, [tracks]);

  //fetch the statistics for
  useEffect(() => {
    if (!tracks || !randomIndexes) return;

    (async () => {
      const a = await getStatistics(
        tracks[randomIndexes[0]].snippet.resourceId.videoId
      );
      const b = await getStatistics(
        tracks[randomIndexes[1]].snippet.resourceId.videoId
      );

      statistics.a = a;
      statistics.b = b;
    })();
  }, [randomIndexes]);

  function userSelected(selection: "A" | "B") {
    if (
      !randomIndexes ||
      statistics.a === undefined ||
      statistics.b === undefined
    )
      return;

    let indexHolder = [...randomIndexes];

    switch (selection) {
      case "A":
        if (
          parseInt(statistics.a.statistics.viewCount) >
          parseInt(statistics.b.statistics.viewCount)
        ) {
          //correct answer
          setScore((prev) => prev + 1);
          setA_Revealed(true);
          setB_Revealed(true);
          setTransitioning(true);

          setTimeout(() => {
            indexHolder[1] = indexHolder[indexHolder.length - 1];
            indexHolder.pop();
            setB_Revealed(false);
            setTransitioning(false);
            setRandomIndexes(indexHolder);
          }, 2000);
        } else {
          //wrong answer
        }

        break;

      case "B":
        if (
          parseInt(statistics.b.statistics.viewCount) >
          parseInt(statistics.a.statistics.viewCount)
        ) {
          //correct answer
          setScore((prev) => prev + 1);
          setB_Revealed(true);
          setA_Revealed(true);
          setTransitioning(true);

          setTimeout(() => {
            setA_Revealed(false);
            indexHolder[0] = indexHolder[indexHolder.length - 1];
            indexHolder.pop();
            setTransitioning(false);
            setRandomIndexes(indexHolder);
          }, 2000);
        } else {
          //wrong answer
        }
        break;

      default:
        break;
    }
  }

  return (
    <>
      <div>
        {/* scoreboard */}
        <div className="absolute top-2/4 -translate-y-2/4 min-w-max sm:top-4 sm:-translate-y-0 left-2/4 -translate-x-2/4 text-center bg-black bg-opacity-80 px-4 py-1 z-10">
          <h1 className="text-lg font-semibold">
            Which Song has the most views on Youtube?
          </h1>
          <span className="font-semibold text-lg mt-2">Score : {score}</span>
        </div>

        {tracks && randomIndexes && !loading && (
          <div className="w-full min-h-svh grid grid-cols-1 grid-rows-2 sm:grid-rows-1 sm:grid-cols-2">
            {/* first track , option A */}
            <div
              className="w-full h-full relative overflow-hidden"
              onClick={() => userSelected("A")}
            >
              <TrackCard
                revealed={A_Revealed}
                video={tracks[randomIndexes[0]]}
                key={randomIndexes[0]}
              />
            </div>

            {/* or */}
            <div className="flex items-center justify-center absolute left-2/4 -translate-x-2/4 h-full w-16">
              <span
                className={`text-2xl font-semibold p-5 aspect-square rounded-full text-black z-[5] transition-all duration-500
                ${
                  transitioning
                    ? "bg-emerald-500 text-white scale-125"
                    : "bg-white"
                }`}
              >
                OR
              </span>

              {/* divider */}
              <div
                className={`absolute h-full w-0 transition-all duration-500
                ${transitioning ? "bg-emerald-500 w-4" : "bg-white"}`}
              ></div>
            </div>

            {/* second track , option B */}
            <div
              className="w-full h-full relative overflow-hidden"
              onClick={() => userSelected("B")}
            >
              <TrackCard
                revealed={B_Revealed}
                video={tracks[randomIndexes[1]]}
                key={randomIndexes[1]}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
