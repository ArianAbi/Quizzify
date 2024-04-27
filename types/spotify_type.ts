interface tracksInterface {
  album: {
    images: [
      {
        url: string;
      },
      {
        url: string;
      },
      {
        url: string;
      }
    ];
  };
  artists: [
    {
      name: string;
      id: string;
    }
  ];
  duration_ms: number;
  id: string;
  name: string;
  popularity: number;
}

export type { tracksInterface as spotify_tracksType };

interface getPlaylistByCategoryInterface {
  message: string;
  playlists: {
    items: [{ id: string }];
  };
}

export type { getPlaylistByCategoryInterface as spotify_playlistByCategoryType };

interface getPlaylistTracksInterface {
  items: [
    {
      track: tracksInterface;
    }
  ];
}

export type { getPlaylistTracksInterface as spotify_playlistTracksType };
