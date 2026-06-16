import { Anime } from "./anime.model";

export interface MediaReaction {
  id: number;
  userId: string;
  animeId: number;
  animeImageUrl: string;
  animeTitle: string;
  animeMediaType: string;
  animeYear: number;
  libraryEntryId: number;
  reaction: string;
  upvoteCount: number;
}