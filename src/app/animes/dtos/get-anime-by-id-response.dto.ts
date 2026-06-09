import { Anime } from "../../shared/models/anime.model";

export interface GetAnimeByIdResponseDto {
  anime: Anime;
  isFavorite: boolean;
}