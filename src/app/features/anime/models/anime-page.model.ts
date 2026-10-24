import { AnimeDetail } from "../../../shared/models/anime.model";

export interface AnimePageModel {
  anime: AnimeDetail;
  isFavorite: boolean;
}