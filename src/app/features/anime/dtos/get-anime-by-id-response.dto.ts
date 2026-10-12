import { Anime, AnimeDetail } from "../../../shared/models/anime.model";

export interface GetAnimeByIdResponseDto {
  anime: AnimeDetail;
  isFavorite: boolean;
}