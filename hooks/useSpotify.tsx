import {
  spotify_playlistByCategoryType,
  spotify_playlistTracksType,
  spotify_tracksType,
} from "../types/spotify_type";

const baseUrl = "https://api.spotify.com/v1";

const access_token_raw = localStorage.getItem("access-token");
const access_token: { access_token: string } | null =
  access_token_raw && JSON.parse(access_token_raw);

const options = {
  method: "GET",
  headers: {
    Authorization: "Bearer " + access_token?.access_token,
  },
};

export async function spotify_storeCredentials() {
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  const SECRET = import.meta.env.VITE_SECRET;

  const spotify_access_token_expire_time_in_milliseconds = 1800 * 1000;

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

  const access_token_with_date = {
    ...result,
    hasCreditTill:
      new Date().getTime() + spotify_access_token_expire_time_in_milliseconds,
  };

  result &&
    localStorage.setItem(
      "access-token",
      JSON.stringify(access_token_with_date)
    );

  return "200 access token set";
}

export async function spotify_renew_access_token() {
  const now = new Date().getTime();

  const stored_access_token = localStorage.getItem("access-token");

  //store access token if we dont have any
  if (!stored_access_token) {
    const result = await spotify_storeCredentials();

    return result;
  }

  const access_token_json = JSON.parse(stored_access_token);

  //if our access token has expired delete the existing one and store a new one
  if (now >= access_token_json.hasCreditTill) {
    localStorage.removeItem("access-token");

    const result = await spotify_storeCredentials();

    return result;
  } else {
    return "spotify access token has now expired yet";
  }
}

export async function spotify_getArtistByID(Artist_ID: string) {
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

export async function spotify_getPlaylistByCategory(category: string) {
  const response = await fetch(
    `${baseUrl}/browse/categories/${category}/playlists`,
    options
  );

  return (await response.json()) as spotify_playlistByCategoryType;
}

export async function spotify_getPlaylistTracks(playlist_id: string) {
  const response = await fetch(
    `${baseUrl}/playlists/${playlist_id}/tracks`,
    options
  );

  return (await response.json()) as spotify_playlistTracksType;
}

export async function spotify_searchTrack(title: string) {
  try {
    const respons = await fetch(
      `${baseUrl}/search?q=${encodeURIComponent(title)}&type=track`,
      options
    );

    const result = await respons.json();

    let most_popular_track = result.tracks.items[0] as spotify_tracksType;

    result.tracks.items.forEach((track: spotify_tracksType) => {
      // Convert titles from spotify and youtube to arrays of words and make them lowercase
      const youtube_title_words = title.toLowerCase().split(/\s+/);
      const spotify_song_title_words = track.name.toLowerCase().split(/\s+/);
      const spotify_song_artist_words = track.artists[0].name
        .toLowerCase()
        .split(/\s+/);

      //if the song is more popular and it contains the name of the song return that
      if (
        //check if the title of the song exists
        spotify_song_title_words.every((word) =>
          youtube_title_words.includes(word)
        ) &&
        //check if the artist name exists
        spotify_song_artist_words.every((word) =>
          youtube_title_words.includes(word)
        ) &&
        track.popularity > most_popular_track.popularity
      ) {
        most_popular_track = track;
      }
    });

    return most_popular_track;
  } catch (err) {
    console.log(err);

    return err;
  }
}
