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

  const [_loading, setLoading] = useState(true);
  const [randomIndexes, setRandomIndexes] = useState<null | number[]>();
  const [tracks, setTracks] = useState<null | youtube_playlistByIdType[]>(null);
  const [score, setScore] = useState(0);

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
    //gets items list from a youtube playlist by id
    (async () => {
      try {
        //stores the spotify access token
        await spotify_storeCredentials();

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

        console.log(clean_list);

        setTracks(clean_list as youtube_playlistByIdType[]);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  //generate the indexes after we got the list of tracks
  useEffect(() => {
    if (!tracks) return;

    setRandomIndexes(generateRandomIndexInRange(tracks.length));
  }, [tracks]);

  useEffect(() => {
    if (!randomIndexes) return;

    console.log(tracks);
    console.log(randomIndexes);
  }, [randomIndexes]);

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
          indexHolder[1] = indexHolder[indexHolder.length - 1];
          indexHolder.pop();
          setRandomIndexes(indexHolder);
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

          indexHolder[0] = indexHolder[indexHolder.length - 1];
          indexHolder.pop();
          setRandomIndexes(indexHolder);
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
        <div className="absolute top-2/4 -translate-y-2/4 min-w-max sm:top-4 sm:-translate-y-0 left-2/4 -translate-x-2/4 text-center bg-black bg-opacity-80 px-4 py-1">
          <h1 className="text-lg font-semibold">
            Which Song has the most views on Youtube?
          </h1>
          <span className="font-semibold text-lg mt-2">Score : {score}</span>
        </div>

        {tracks && randomIndexes && (
          <div className="w-full min-h-svh grid grid-cols-1 grid-rows-2 sm:grid-rows-1 sm:grid-cols-2">
            {/* first track , option A */}
            <div
              className="w-full h-full relative overflow-hidden"
              onClick={() => userSelected("A")}
            >
              <TrackCard
                video={tracks[randomIndexes[0]]}
                key={randomIndexes[0]}
              />
            </div>

            {/* second track , option B */}
            <div
              className="w-full h-full relative overflow-hidden"
              onClick={() => userSelected("B")}
            >
              <TrackCard
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
