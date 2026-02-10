import { Anime } from "./anime.model";

export interface FavoriteAnime {
  userId: string;
  animeId: number;
  anime: Anime;
}