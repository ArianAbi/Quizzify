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
}

export type { tracksInterface as tracksType };

interface getPlaylistByCategoryInterface {
  message: string;
  playlists: {
    items: [{ id: string }];
  };
}

export type { getPlaylistByCategoryInterface as getPlaylistByCategoryType };

interface getPlaylistTracksInterface {
  items: [
    {
      track: tracksInterface;
    }
  ];
}

export type { getPlaylistTracksInterface as getPlaylistTracksType };
