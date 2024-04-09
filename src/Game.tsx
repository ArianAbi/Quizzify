import { useEffect, useState } from "react";
import "./css/Game.css";
import { youtube_playlistByIdType } from "../types/youtube_types";
import { getPlaylistItemsById } from "../hooks/useYoutube";
import TrackCard from "./components/TrackCard";
import { spotify_storeCredentials } from "../hooks/useSpotify";

export default function Game() {
  const youtube_00s_playlist = "PLcLtbK8Nf64InyudI1rnYwwRbCr08yup_";

  const [loading, setLoading] = useState(true);
  const [fetchedTracks, setFetchedTracks] = useState<
    null | youtube_playlistByIdType[]
  >(null);

  useEffect(() => {
    //stores the spotify access token
    spotify_storeCredentials();

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
          {fetchedTracks && (
            <div className="w-full h-full relative overflow-hidden">
              A
              <TrackCard video={fetchedTracks[0]} />
            </div>
          )}

          {/* second track , indexB */}
          {fetchedTracks && (
            <div className="w-full h-full relative overflow-hidden">
              B
              <TrackCard video={fetchedTracks[3]} />
            </div>
          )}
        </div>

        <div style={{ textAlign: "center" }}>
          <h2>List of Tracks</h2>
          <ul>
            {fetchedTracks &&
              fetchedTracks.map((item, _i: number) => {
                const thumbnail = item.snippet.thumbnails.medium;

                const [artist, title] = item.snippet.title.split(" - ");

                return (
                  <li className="flex flex-col gap-2" key={_i}>
                    {thumbnail != undefined && <img src={thumbnail.url} />}
                    <span>{title}</span>
                    <span>by : {artist}</span>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </>
  );
}
