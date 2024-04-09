import {
  youtubePlaylistByIdType,
  youtubeVideoStatisticsType,
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

    return result.items as youtubePlaylistByIdType[];
  } catch (err) {
    console.log(err);
  }
}

export async function getVideoStatistics(id: string) {
  try {
    const response = await fetch(
      `${baseUrl}/videos?part=statistics&id=${id}&key=${KEY}`
    );

    const result = await response.json();

    return result.items as youtubeVideoStatisticsType;
  } catch (err) {
    console.log(err);
  }
}
