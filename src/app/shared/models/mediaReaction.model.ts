import { Anime } from "./anime.model";

export interface MediaReaction {
  id: number;
  userId: string;
  anime: Anime;
  animeId: number;
  libraryEntryId: number;
  reaction: string;
  upvoteCount: number;
  dateCreated: Date;
  dateUpdated: Date;  
}