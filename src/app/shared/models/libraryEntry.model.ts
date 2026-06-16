import { Anime } from "./anime.model";
import { MediaReaction } from "./mediaReaction.model";

export interface LibraryEntry {
  id: number;
  displayId: string; //needed??
  animeId: number;
  watchStatus?: string;
  userRating?: number;
  episodesWatched: number;
  anime: Anime;
  mediaReaction?: MediaReaction;
}