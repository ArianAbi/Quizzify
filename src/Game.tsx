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
  const [randomIndexes, setIndexes] = useState<null | number[]>();
  const [tracks, setTracks] = useState<null | youtube_playlistByIdType[]>(null);

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

    setIndexes(generateRandomIndexInRange(tracks.length));
  }, [tracks]);

  useEffect(() => {
    if (!tracks) return;

    if (tracks.length <= 2) {
      alert("List Is to Short");
    }
  }, [tracks]);

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
          console.log("A is Bigger");

          indexHolder[1] = indexHolder[indexHolder.length - 1];
          indexHolder.pop();
          setIndexes(indexHolder);
        } else {
          console.log("B is Bigger");
        }

        break;

      case "B":
        if (
          parseInt(statistics.b.statistics.viewCount) >
          parseInt(statistics.a.statistics.viewCount)
        ) {
          console.log("B is Bigger");

          indexHolder[0] = indexHolder[indexHolder.length - 1];
          indexHolder.pop();
          setIndexes(indexHolder);
        } else {
          console.log("A is Bigger");
        }
        break;

      default:
        break;
    }
  }

  return (
    <>
      <div className="container">
        <span>{loading ? "loading..." : "All Set"}</span>

        {tracks && randomIndexes && (
          <div className="w-full grid grid-cols-2 min-h-[500px]">
            {/* first track , option A */}
            <div
              className="w-full h-full relative overflow-hidden"
              onClick={() => userSelected("A")}
            >
              A
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
              B
              <TrackCard
                video={tracks[randomIndexes[1]]}
                key={randomIndexes[1]}
              />
            </div>
          </div>
        )}

        <div style={{ textAlign: "center" }}>
          <h2>List of Tracks</h2>
          <ul>
            {tracks &&
              tracks.map((item, _i: number) => {
                const thumbnail = item.snippet.thumbnails.medium;

                const title = item.snippet.title.replace(/ *\([^)]*\) */g, "");

                return (
                  <li className="flex flex-col gap-2" key={_i}>
                    {thumbnail != undefined && <img src={thumbnail.url} />}
                    <span>{title}</span>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </>
  );
}
