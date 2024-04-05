import { useEffect, useRef, useState } from "react";
import "./css/Game.css";
import {
  getCredentials,
  getPlaylistByCategory,
  getPlaylistTracks,
} from "../hooks/useSpotify";
import {
  generateDiffrentRandomIndex,
  generateRandomIndexInRange,
} from "../hooks/useRandomIndexGenerator";
import { tracksType } from "../types/type";
import TrackCard from "./components/TrackCard";

export default function Game() {
  const [loading, setLoading] = useState(true);
  const [fetchedTracks, setFetchedTracks] = useState<null | tracksType[]>(null);
  const availableTracks: any = useRef(undefined);

  const [indexA, setIndexA] = useState(-1);
  const [indexB, setIndexB] = useState(-1);

  useEffect(() => {
    async function storeCredentials() {
      try {
        const credentials = await getCredentials();
        localStorage.setItem("access-token", JSON.stringify(credentials));
      } catch (err) {
        console.error("SOME ERROR OCCURRED : " + err);
      }
    }

    async function getTracksFromPlaylist(genre: string) {
      try {
        const playlist = (await getPlaylistByCategory(genre)).playlists.items;
        const playlist_tracks = await getPlaylistTracks(playlist[0].id);
        const tracks = playlist_tracks.items.map(
          (track_item) => track_item.track as tracksType
        );

        setFetchedTracks(tracks);
        availableTracks.current = tracks;
      } catch (err) {
        console.log(err);
      }
    }

    storeCredentials();
    getTracksFromPlaylist("metal");
  }, []);

  //set loading to false if we successfuly fetched the tracks from a playlist and generate the first index
  useEffect(() => {
    if (fetchedTracks) {
      setLoading(false);
      setIndexA(generateRandomIndexInRange(0, fetchedTracks.length));
    }
  }, [fetchedTracks]);

  //generate the second index
  useEffect(() => {
    if (indexA >= 0 && fetchedTracks) {
      setIndexB(generateDiffrentRandomIndex(indexA, 0, fetchedTracks.length));
    }
  }, [indexA]);

  //log on availableTracks change
  // useEffect(() => {
  //   console.log(availableTracks.current);
  // }, [availableTracks.current]);

  function onUserSelection(selection_index: "indexA" | "indexB") {
    if (fetchedTracks === null) {
      return;
    }

    switch (selection_index) {
      case "indexA":
        if (
          fetchedTracks[indexA].duration_ms > fetchedTracks[indexB].duration_ms
        ) {
          console.log("Correct Answer, A is Longer");
        } else {
          console.log("Wrong Answer, B is Longer");
        }

        break;

      case "indexB":
        if (
          fetchedTracks[indexB].duration_ms > fetchedTracks[indexA].duration_ms
        ) {
          console.log("Correct Answer, B is Longer");
        } else {
          console.log("Wrong Answer, A is Longer");
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

        <div className="w-full grid grid-cols-2 min-h-[500px]">
          {/* first track , indexA */}
          <div
            className="w-full h-full relative overflow-hidden"
            onClick={() => onUserSelection("indexA")}
          >
            A
            {fetchedTracks && indexA >= 0 && (
              <TrackCard track={fetchedTracks[indexA]} />
            )}
          </div>

          {/* second track , indexB */}
          <div
            className="w-full h-full relative overflow-hidden"
            onClick={() => onUserSelection("indexB")}
          >
            B
            {fetchedTracks && indexB >= 0 && (
              <TrackCard track={fetchedTracks[indexB]} />
            )}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <h2>List of Tracks</h2>
          <ul>
            {fetchedTracks &&
              fetchedTracks.map((track, _i: number) => {
                const minutes = Math.floor(track.duration_ms / 1000 / 60);
                const remainig_seconds = (
                  track.duration_ms / 1000 -
                  minutes * 60
                ).toFixed(0);

                return (
                  <li key={_i}>
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
      </div>
    </>
  );
}
