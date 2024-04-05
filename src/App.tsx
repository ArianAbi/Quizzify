import { useState, useEffect } from "react";
import {
  getCredentials,
  getPlaylistByCategory,
  getPlaylistTracks,
} from "../hooks/useSpotify";
import "./css/App.css";
import { tracksType } from "../types/type";
import { Link } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);
  // const [artistsList, setArtistsList] = useState<[{}] | null>(null);
  const [tracks, setTracks] = useState<tracksType[] | null>(null);

  useEffect(() => {
    async function storeCredentials() {
      try {
        const credentials = await getCredentials();
        localStorage.setItem("access-token", JSON.stringify(credentials));

        setLoading(false);
      } catch (err) {
        console.error("SOME ERROR OCCURRED : " + err);
      }
    }

    storeCredentials();
  }, []);

  async function getListOfTracks(genre: string) {
    setLoading(true);

    const playlists = (await getPlaylistByCategory(genre)).playlists.items;

    const playlist_tracks = await getPlaylistTracks(playlists[0].id);

    const tracks = playlist_tracks.items.map((item: any) => {
      return item.track as tracksType;
    });

    setTracks(tracks);

    setLoading(false);
  }

  return (
    <>
      <div className="container">
        <span>{loading ? "loading..." : "All Set"}</span>

        <div>
          <button onClick={() => getListOfTracks("metal")}>
            Get Metal Tracks
          </button>
          <button
            style={{ marginInline: "1rem" }}
            onClick={() => getListOfTracks("pop")}
          >
            Get Pop Tracks
          </button>
          <Link
            to={"/game"}
            style={{ marginInline: "1rem", color: "white" }}
            onClick={() => getListOfTracks("pop")}
          >
            Go To Game
          </Link>
        </div>

        <ul>
          {tracks &&
            tracks.map((track, i) => {
              const minutes = Math.floor(track.duration_ms / 1000 / 60);
              const remainig_seconds = (
                track.duration_ms / 1000 -
                minutes * 60
              ).toFixed(0);

              return (
                <li key={i}>
                  <img src={track.album.images[2].url} />

                  <div className="song-detail">
                    <span>{track.name}</span>
                    <span>by {track.artists[0].name}</span>
                    <span>{`${minutes}:${remainig_seconds}`}</span>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
}

export default App;
