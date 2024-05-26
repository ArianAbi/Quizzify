import { useEffect, useState, useRef, useContext } from "react";
import {
  youtube_playlistByIdType,
  youtube_videoStatisticsType,
} from "../types/youtube_types";
import { getPlaylistItemsById, getVideoStatistics } from "../hooks/useYoutube";
import TrackCard from "./components/TrackCard";
import { spotify_renew_access_token } from "../hooks/useSpotify";
import { generateRandomIndexInRange } from "../hooks/useRandomIndexGenerator";
import { useSearchParams } from "react-router-dom";
import { gameModeContext } from "./GameModeContext";
import Home_Icon from "./assets/icons/Home_Icon";
import X_Icon from "./assets/icons/X_Icon";
import GameLost from "./components/GameLost";
import Separator from "./components/Separator";

export default function Game() {
  const [searchParams] = useSearchParams();

  const { gameMode } = useContext(gameModeContext);
  const playlist_Url = searchParams.get("playlist");

  const [loading, setLoading] = useState(true);
  const [randomIndexes, setRandomIndexes] = useState<null | number[]>();
  const [tracks, setTracks] = useState<null | youtube_playlistByIdType>(null);

  const [score, setScore] = useState(0);
  const [lossScore, setLossScore] = useState(0);

  const [A_Revealed, setA_Revealed] = useState(false);
  const [B_Revealed, setB_Revealed] = useState(false);

  const [transitionState, setTransitioning] = useState<{
    isTransitiong: boolean;
    answerWas: "wrong" | "correct";
  }>({ isTransitiong: false, answerWas: "correct" });
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
      await spotify_renew_access_token().then(() => {
        window.location.reload();
      });
    })();
  }, []);

  useEffect(() => {
    if (!playlist_Url) return;

    //gets items list from a youtube playlist by id
    (async () => {
      try {
        const data = (await getPlaylistItemsById(
          playlist_Url
        )) as youtube_playlistByIdType;

        if (data === undefined || data === null) {
          throw new Error("failed to fetch the playlist items");
        }

        console.log(data.nextPageToken);

        //remove deleted videos to prevent errors
        const clean_items = data.items.filter((item) => {
          if (item.snippet.title !== "Deleted video") {
            return item;
          }
        });

        setTracks({ items: clean_items, nextPageToken: data.nextPageToken });
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [loading]);

  //generate the indexes after we got the list of tracks
  useEffect(() => {
    if (!tracks) return;

    setRandomIndexes(generateRandomIndexInRange(tracks.items.length));
  }, [tracks]);

  useEffect(() => {
    if (!tracks) return;

    if (tracks.items.length <= 2) {
      alert("List Is to Short");
    }
  }, [tracks]);

  //fetch the statistics for
  useEffect(() => {
    if (!tracks || !randomIndexes) return;

    (async () => {
      const a = await getStatistics(
        tracks.items[randomIndexes[0]].snippet.resourceId.videoId
      );
      const b = await getStatistics(
        tracks.items[randomIndexes[1]].snippet.resourceId.videoId
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
    setTransitioning({ isTransitiong: true, answerWas: "correct" });

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

      setTransitioning({ isTransitiong: false, answerWas: "correct" });
      setRandomIndexes(indexHolder);
    }, 2000);
  }

  function onWrongSelection(selectedOption: options) {
    if (!randomIndexes) return;

    const indexHolder = [...randomIndexes];

    setLossScore((prev) => prev + 1);
    setA_Revealed(true);
    setB_Revealed(true);
    setTransitioning({ isTransitiong: true, answerWas: "wrong" });

    setTimeout(() => {
      //change both options every third time

      if (lossScore >= 3) return;

      if (selectedOption === options.A) {
        indexHolder[options.B] = indexHolder[indexHolder.length - 1];
        indexHolder.pop();
        setB_Revealed(false);
      } else if (selectedOption === options.B) {
        indexHolder[options.A] = indexHolder[indexHolder.length - 1];
        indexHolder.pop();
        setA_Revealed(false);
      }

      setTransitioning({ isTransitiong: false, answerWas: "wrong" });
      setRandomIndexes(indexHolder);
    }, 2000);
  }

  //end the game if user has picked 3 wrong answers
  useEffect(() => {
    if (lossScore >= 3) {
      setGameEnded(true);
    }
  }, [lossScore]);

  function userSelected(selection: "A" | "B") {
    //dont accept inputs if the game is lost or its changing
    if (transitionState.isTransitiong || gameEnded) return;

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
          onWrongSelection(options.A);
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
          onWrongSelection(options.B);
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
                video={tracks.items[randomIndexes[0]]}
                key={randomIndexes[0]}
              />
            </div>

            {/* or */}
            <Separator
              isTransitiong={transitionState.isTransitiong}
              answerWas={transitionState.answerWas}
            />

            {/* second track , option B */}
            <div
              className="w-full h-full relative overflow-hidden"
              onClick={() => userSelected("B")}
            >
              <TrackCard
                revealed={B_Revealed}
                video={tracks.items[randomIndexes[1]]}
                key={randomIndexes[1]}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
