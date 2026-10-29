export interface AnimeTableResponseItemDto {
  id: number;
  title: string;
  score?: number;
  releaseStatus?: string;
  imageUrl?: string;
  year?: number;
  episodeCount?: number;
  mediaType?: string;
}