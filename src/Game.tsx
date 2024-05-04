import { useEffect, useState, useRef, useContext } from "react";
import {
  youtube_playlistByIdType,
  youtube_videoStatisticsType,
} from "../types/youtube_types";
import { getPlaylistItemsById, getVideoStatistics } from "../hooks/useYoutube";
import TrackCard from "./components/TrackCard";
import { spotify_storeCredentials } from "../hooks/useSpotify";
import { generateRandomIndexInRange } from "../hooks/useRandomIndexGenerator";
import Check_Icon from "./assets/icons/Check_Icon";
import { useSearchParams } from "react-router-dom";
import { gameModeContext } from "./GameModeContext";
import Home_Icon from "./assets/icons/Home_Icon";
import X_Icon from "./assets/icons/X_Icon";
import GameLost from "./components/GameLost";

export default function Game() {
  const [searchParams] = useSearchParams();

  const { gameMode } = useContext(gameModeContext);
  const playlist_Url = searchParams.get("playlist");

  const [loading, setLoading] = useState(true);
  const [randomIndexes, setRandomIndexes] = useState<null | number[]>();
  const [tracks, setTracks] = useState<null | youtube_playlistByIdType[]>(null);

  const [score, setScore] = useState(0);
  const [lossScore, setLossScore] = useState(0);

  const [A_Revealed, setA_Revealed] = useState(false);
  const [B_Revealed, setB_Revealed] = useState(false);

  const [transitioning, setTransitioning] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

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
      //open the body with animation
      setTimeout(() => {
        document.body.classList.remove("closed");
      }, 500);

      //return if we have a access-token
      if (localStorage.getItem("access-token")) return;

      //stores the spotify access token if we dont have it and reload
      await spotify_storeCredentials().then(() => {
        window.location.reload();
      });
    })();
  }, []);

  useEffect(() => {
    if (!playlist_Url) return;

    //gets items list from a youtube playlist by id
    (async () => {
      try {
        const data = (await getPlaylistItemsById(playlist_Url)) as {
          items: youtube_playlistByIdType[];
        };

        if (data === undefined || data === null) {
          throw new Error("failed to fetch the playlist items");
        }

        //remove deleted videos to prevent errors
        const clean_list = data.items.filter(
          (item: youtube_playlistByIdType) => {
            if (item.snippet.title !== "Deleted video") {
              return item as youtube_playlistByIdType;
            }
          }
        );

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

  //the left TrackCard selects its track from the first indicie of the randomIndexes (so 0)
  //and the Right TrackCard selects its track from the second indicie of the randomIndexes (so 1)
  enum options {
    A = 0,
    B = 1,
  }

  function onCorrectSelect(correctOption: options) {
    if (!randomIndexes) return;

    const indexHolder = [...randomIndexes];

    setScore((prev) => prev + 1);
    setA_Revealed(true);
    setB_Revealed(true);
    setTransitioning(true);

    setTimeout(() => {
      //change both options every third time

      if (score !== 0 && (score + 1) % 3 === 0) {
        indexHolder[options.B] = indexHolder[indexHolder.length - 1];
        indexHolder.pop();
        indexHolder[options.A] = indexHolder[indexHolder.length - 1];
        indexHolder.pop();

        setA_Revealed(false);
        setB_Revealed(false);
      } else if (correctOption === options.A) {
        indexHolder[options.B] = indexHolder[indexHolder.length - 1];
        indexHolder.pop();
        setB_Revealed(false);
      } else if (correctOption === options.B) {
        indexHolder[options.A] = indexHolder[indexHolder.length - 1];
        indexHolder.pop();
        setA_Revealed(false);
      }

      setTransitioning(false);
      setRandomIndexes(indexHolder);
    }, 2000);
  }

  function onWrongSelection() {
    setLossScore((prev) => prev + 1);
  }

  //end the game if user has picked 3 wrong answers
  useEffect(() => {
    if (lossScore >= 3) {
      setGameEnded(true);
    }
  }, [lossScore]);

  function userSelected(selection: "A" | "B") {
    //dont accept inputs if the game is lost or its changing
    if (transitioning || gameEnded) return;

    function getReleventStatisticsData(
      gameMode: string,
      forTrackCard: "A" | "B"
    ) {
      if (statistics.a === undefined || statistics.b === undefined) return;

      switch (gameMode) {
        case "view":
          if (forTrackCard === "A") {
            return statistics.a.statistics.viewCount;
          } else {
            return statistics.b.statistics.viewCount;
          }

        case "likes":
          if (forTrackCard === "A") {
            return statistics.a.statistics.likeCount;
          } else {
            return statistics.b.statistics.likeCount;
          }

        default:
          if (forTrackCard === "A") {
            return statistics.a.statistics.viewCount;
          } else {
            return statistics.b.statistics.viewCount;
          }
      }
    }

    const a_statistics_to_compare = getReleventStatisticsData(
      gameMode ? gameMode : "",
      "A"
    );
    const b_statistics_to_compare = getReleventStatisticsData(
      gameMode ? gameMode : "",
      "B"
    );

    if (!a_statistics_to_compare || !b_statistics_to_compare) return;

    switch (selection) {
      case "A":
        if (
          parseInt(a_statistics_to_compare) > parseInt(b_statistics_to_compare)
        ) {
          //correct answer
          onCorrectSelect(options.A);
        } else {
          //wrong answer
          onWrongSelection();
        }

        break;

      case "B":
        if (
          parseInt(b_statistics_to_compare) > parseInt(a_statistics_to_compare)
        ) {
          //correct answer
          onCorrectSelect(options.B);
        } else {
          //wrong answer
          onWrongSelection();
        }
        break;

      default:
        break;
    }
  }

  return (
    <>
      {gameEnded && <GameLost score={score} />}

      <div className="relative overflow-hidden">
        {/* Home button */}
        <a
          className="absolute right-4 top-4 z-[999999] bg-black rounded-md bg-opacity-80 p-2 transition-all duration-150 hover:scale-110"
          href="/"
        >
          <Home_Icon />
        </a>

        {/* game mode display */}
        <div className="absolute bottom-3 left-4 bg-black rounded-md px-2 py-1 bg-opacity-80 opacity-60 pointer-events-none">
          game mode :{" "}
          <span className="underline underline-offset-4">{gameMode}</span>
        </div>

        {/* scoreboard */}
        <div className="absolute flex flex-col gap-2 left-2/4 top-4 -translate-x-2/4 z-[9999] pointer-events-none bg-black bg-opacity-50 py-3 px-4 text-center rounded-md">
          <span className="font-semibold text-sm md:text-lg">
            Score : {score}
          </span>

          <span className="flex justify-center gap-2 font-semibold scale-75 sm:scale-100">
            {Array(3)
              .fill("")
              .map((_e, _i) => {
                return (
                  <X_Icon
                    key={_i}
                    className={`${
                      _i + 1 <= lossScore ? "check-loss-x" : "text-white"
                    }`}
                  />
                );
              })}
          </span>
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
            <div className="flex items-center justify-center absolute left-2/4 -translate-x-2/4 w-full h-full pointer-events-none z-40">
              <span
                className={`text-lg md:text-2xl font-semibold p-5 aspect-square rounded-full text-black z-[5] transition-all duration-500 h-16 w-16 md:w-20 md:h-20 relative
                ${
                  transitioning
                    ? "bg-emerald-500 text-white scale-125"
                    : "bg-white"
                }`}
              >
                <span
                  className={`absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 transition-all duration-3
                ${transitioning ? "scale-0" : "scale-100"}`}
                >
                  OR
                </span>

                <Check_Icon
                  className={`absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white transition-all duration-500
                  ${
                    transitioning
                      ? "scale-100 rotate-0"
                      : "scale-0 -rotate-[180deg]"
                  }`}
                />
              </span>

              {/* divider */}
              <div
                className={`absolute h-full transition-[width] duration-500 rotate-90 sm:rotate-0
                ${
                  transitioning
                    ? "bg-emerald-500 w-3 md:w-4"
                    : "bg-white w-1 md:w-2"
                }`}
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
