import {
  youtube_playlistByIdType,
  youtube_videoStatisticsType,
} from "../types/youtube_types";

const KEY = import.meta.env.VITE_YOUTUBE_KEY;
const baseUrl = `https://youtube.googleapis.com/youtube/v3`;

export async function getVideoByTerm(term: string) {
  try {
    const response = await fetch(
      `${baseUrl}/search?part=snippet&q=${term}&key=${KEY}`
    );
    return await response.json();
  } catch (err) {
    return err;
  }
}

export async function getPlaylistItemsById(id: string) {
  try {
    const response = await fetch(
      `${baseUrl}/playlistItems?part=snippet&maxResults=50&playlistId=${id}&key=${KEY}`
    );

    const result = await response.json();

    return {
      items: result.items as youtube_playlistByIdType[],
      nextPageToken: result.nextPageToken as string,
    };
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function getVideoStatistics(id: string) {
  try {
    const response = await fetch(
      `${baseUrl}/videos?part=statistics&id=${id}&key=${KEY}`
    );

    const result = await response.json();

    return result.items[0] as youtube_videoStatisticsType;
  } catch (err) {
    console.log(err);
    return err;
  }
}
