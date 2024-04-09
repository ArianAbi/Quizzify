import { useEffect, useRef, useState } from "react";
import "./css/Game.css";
import {
  youtubePlaylistByIdType,
  youtubeVideoStatisticsType,
} from "../types/youtube_types";
import { getPlaylistItemsById, getVideoStatistics } from "../hooks/useYoutube";

export default function Game() {
  const youtube_00s_playlist = "PLcLtbK8Nf64InyudI1rnYwwRbCr08yup_";

  const [loading, setLoading] = useState(true);
  const [fetchedTracks, setFetchedTracks] = useState<
    null | youtubePlaylistByIdType[]
  >(null);

  useEffect(() => {
    //gets items list from a youtube playlist by id
    (async () => {
      try {
        const items = await getPlaylistItemsById(youtube_00s_playlist);

        items && setFetchedTracks(items);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <>
      <div className="container">
        <span>{loading ? "loading..." : "All Set"}</span>

        <div className="w-full grid grid-cols-2 min-h-[500px]">
          {/* first track , indexA */}
          <div className="w-full h-full relative overflow-hidden">A</div>

          {/* second track , indexB */}
          <div className="w-full h-full relative overflow-hidden">B</div>
        </div>

        <div style={{ textAlign: "center" }}>
          <h2>List of Tracks</h2>
          <ul>
            {fetchedTracks &&
              fetchedTracks.map((item, _i: number) => {
                const thumbnail = item.snippet.thumbnails.medium;

                return (
                  <li key={_i}>
                    {thumbnail != undefined && <img src={thumbnail.url} />}
                    <span>{item.snippet.title}</span>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </>
  );
}
