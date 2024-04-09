interface youtube_playlistById {
  snippet: {
    description: string;
    title: string;
    resourceId: {
      kind: string;
      videoId: string;
    };
    thumbnails: {
      default: {
        url: string;
        height: number;
        width: number;
      };
      high: {
        url: string;
        height: number;
        width: number;
      };
      medium: {
        url: string;
        height: number;
        width: number;
      };
      standard: {
        url: string;
        height: number;
        width: number;
      };
    };
  };
}

export type { youtube_playlistById as youtube_playlistByIdType };

interface youtube_videoStatistics {
  id: string;
  statistics: {
    commentCount: string;
    likeCount: string;
    viewCount: string;
  };
}

export type { youtube_videoStatistics as youtube_videoStatisticsType };
