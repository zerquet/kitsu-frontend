export interface GetExploreAnimeResponseDto {
  highestRatedAnime: AnimeResponseItemDto[],
  newAnime: AnimeResponseItemDto[],
  popularAnime: AnimeResponseItemDto[]
}

export interface AnimeResponseItemDto {
  id: number;
  title: string;
  description?: string;
  score?: number;
  imageUrl?: string;
  year?: number;
}