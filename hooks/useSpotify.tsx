import {
  getPlaylistByCategoryType,
  getPlaylistTracksType,
} from "../types/type";

const baseUrl = "https://api.spotify.com/v1";

const access_token_raw = localStorage.getItem("access-token");
const access_token = access_token_raw && JSON.parse(access_token_raw);

const options = {
  method: "GET",
  headers: {
    Authorization: "Bearer " + access_token.access_token,
  },
};

export async function getCredentials() {
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  const SECRET = import.meta.env.VITE_SECRET;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body:
      "grant_type=client_credentials&client_id=" +
      CLIENT_ID +
      "&client_secret=" +
      SECRET,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const result = await response.json();
  return result;
}

export async function getArtistByID(Artist_ID: string) {
  const response = await fetch(`${baseUrl}/artists/${Artist_ID}`, options);

  return await response.json();
}

export async function getList(type: "artist") {
  const q = "*";

  const response = await fetch(
    `${baseUrl}/search?q=${q}&type=${type}`,
    options
  );

  return await response.json();
}

export async function getPlaylistByCategory(category: string) {
  const response = await fetch(
    `${baseUrl}/browse/categories/${category}/playlists`,
    options
  );

  return (await response.json()) as getPlaylistByCategoryType;
}

export async function getPlaylistTracks(playlist_id: string) {
  const response = await fetch(
    `${baseUrl}/playlists/${playlist_id}/tracks`,
    options
  );

  return (await response.json()) as getPlaylistTracksType;
}

export async function getTracksStreams(track_id: string) {
  const url =
    "https://spotify-track-streams-playback-count1.p.rapidapi.com/tracks/spotify_track_streams?spotify_track_id=6ho0GyrWZN3mhi9zVRW7xi&isrc=CA5KR1821202";
  const options2 = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "168aa06500mshcebc1f433fc8bd0p18c58ajsnbc4394fe53bc",
      "X-RapidAPI-Host": "spotify-track-streams-playback-count1.p.rapidapi.com",
    },
  };

  const response = await fetch(url, options2);

  return await response.json();
}
