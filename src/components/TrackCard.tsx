import { spotify_searchTrack } from "../../hooks/useSpotify";
import { spotify_tracksType } from "../../types/spotify_type";
import { getVideoStatistics } from "../../hooks/useYoutube";
import {
  youtube_playlistByIdType,
  youtube_videoStatisticsType,
} from "../../types/youtube_types";
import { useState, useEffect } from "react";

export default function TrackCard({
  video,
}: {
  video: youtube_playlistByIdType;
}) {
  const [loading, setLoading] = useState(true);

  const [statistics, setStatistics] =
    useState<null | youtube_videoStatisticsType>(null);

  const [trackFromSpotify, setTrackFromSpotify] =
    useState<null | spotify_tracksType>(null);

  const [artist, title] = video.snippet.title.split("-");

  useEffect(() => {
    getStatistics(video.snippet.resourceId.videoId);

    getTrackFromSpotify(artist, title);
  }, []);

  async function getTrackFromSpotify(artist: string, title: string) {
    try {
      const track = await spotify_searchTrack(artist, title);

      track && setTrackFromSpotify(track);
      setLoading(false);
    } catch (err) {
      console.log(err);

      setLoading(false);
    }
  }

  async function getStatistics(id: string) {
    try {
      const result = await getVideoStatistics(id);

      setStatistics(result as youtube_videoStatisticsType);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      {trackFromSpotify && (
        <div className="cursor-pointer text-xl font-bold overflow-hidden h-full w-full relative flex flex-col gap-6 justify-center items-center group">
          <img
            className="absolute left-0 top-0 w-full h-full z-[-1] object-cover transition-all brightness-75 group-hover:brightness-50"
            src={trackFromSpotify.album.images[0].url}
          />
          <h2>{trackFromSpotify.name}</h2>
          <h2>by {trackFromSpotify.artists[0].name}</h2>

          {statistics && (
            <span className="absolute bottom-8 left-2/4 -translate-x-2/4">
              Views :{" "}
              {parseInt(statistics.statistics.viewCount).toLocaleString()}
            </span>
          )}
        </div>
      )}

      {!trackFromSpotify && !loading && (
        <div className="cursor-pointer text-xl font-bold overflow-hidden h-full w-full relative flex flex-col gap-6 justify-center items-center group">
          <img
            className="absolute left-0 top-0 w-full h-full z-[-1] object-cover transition-all brightness-75 group-hover:brightness-50"
            src={video.snippet.thumbnails.standard.url}
          />
          <h2>{title}</h2>
          <h2>by {artist}</h2>

          {statistics && (
            <span className="absolute bottom-8 left-2/4 -translate-x-2/4">
              Views :{" "}
              {parseInt(statistics.statistics.viewCount).toLocaleString()}
            </span>
          )}
        </div>
      )}
    </>
  );
}
