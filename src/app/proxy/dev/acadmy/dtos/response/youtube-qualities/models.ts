
export interface YoutubeQualityDto {
  label?: string;
  resolution: number;
  videoUrl?: string;
  audioUrl?: string;
  isAdaptive: boolean;
}

export interface YoutubeVideoResultDto {
  title?: string;
  qualities: YoutubeQualityDto[];
}
