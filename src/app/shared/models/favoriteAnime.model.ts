import { Anime } from "./anime.model";

export interface FavoriteAnime {
  userId: string; //needed????
  animeId: number;
  anime: Anime;
}