import { spotify_searchTrack } from "../../hooks/useSpotify";
import { spotify_tracksType } from "../../types/spotify_type";
import { getVideoStatistics } from "../../hooks/useYoutube";
import {
  playlist_item_type,
  youtube_videoStatisticsType,
} from "../../types/youtube_types";
import { useState, useEffect, useContext, useLayoutEffect } from "react";
import ProgressiveImage from "./ProgressiveImage";
import AnimatedContainer from "./AnimatedContainer";
import { gameModeContext } from "@/GameModeContext";

export default function TrackCard({
  video,
  revealed,
}: {
  video: playlist_item_type;
  revealed?: boolean;
}) {
  const [loading, setLoading] = useState(true);
  const { gameMode } = useContext(gameModeContext);
  const gameModeUppercased =
    gameMode.charAt(0).toLocaleUpperCase() + gameMode.slice(1);

  const [statistics, setStatistics] =
    useState<null | youtube_videoStatisticsType>(null);

  const [trackFromSpotify, setTrackFromSpotify] =
    useState<null | spotify_tracksType>(null);

  useEffect(() => {
    getStatistics(video.snippet.resourceId.videoId);

    getTrackFromSpotify(video.snippet.title);
  }, []);

  async function getTrackFromSpotify(title: string) {
    try {
      const track = (await spotify_searchTrack(title)) as spotify_tracksType;

      track && setTrackFromSpotify(track);
    } catch (err) {
      console.log(err);

      setLoading(false);
    }
  }

  useLayoutEffect(() => {
    setLoading(false);
  }, [trackFromSpotify]);

  async function getStatistics(id: string) {
    try {
      const result = (await getVideoStatistics(
        id
      )) as youtube_videoStatisticsType;

      setStatistics(result);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      {!loading && trackFromSpotify && (
        <div className="cursor-pointer text-xl font-bold overflow-hidden h-full w-full relative flex flex-col gap-6 justify-center items-center group text-center">
          <ProgressiveImage
            className="absolute left-0 top-0 w-full h-full z-[-1] object-cover transition-all brightness-75 group-hover:brightness-50"
            img={trackFromSpotify.album.images[0].url}
            placeholderImg={
              trackFromSpotify.album.images[
                trackFromSpotify.album.images.length - 1
              ].url
            }
          />
          <AnimatedContainer duration="0.2s" className="bg-black bg-opacity-60">
            <div className="text-sm md:text-lg xl:text-xl">
              <h3>{trackFromSpotify.name}</h3>
              <span className={`${revealed ? "mb-4" : ""} mt-4`}>
                by {trackFromSpotify.artists[0].name}
              </span>
            </div>

            {statistics && (
              <span
                key={video.snippet.title}
                style={{
                  display: revealed ? "block" : "none",
                }}
              >
                {gameModeUppercased} :{" "}
                {gameMode === "views" &&
                  parseInt(statistics.statistics.viewCount).toLocaleString()}
                {gameMode === "likes" &&
                  parseInt(statistics.statistics.likeCount).toLocaleString()}
              </span>
            )}
          </AnimatedContainer>
        </div>
      )}

      {loading && (
        <div className="cursor-pointer text-xl font-bold overflow-hidden h-full w-full relative flex flex-col gap-6 justify-center items-center group text-center">
          loading
        </div>
      )}
    </>
  );
}
