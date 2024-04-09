interface youtubePlaylistById {
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

export type { youtubePlaylistById as youtubePlaylistByIdType };

interface youtubeVideoStatistics {
  id: string;
  statistics: {
    commentCount: string;
    likeCount: string;
    viewCount: string;
  };
}

export type { youtubeVideoStatistics as youtubeVideoStatisticsType };
