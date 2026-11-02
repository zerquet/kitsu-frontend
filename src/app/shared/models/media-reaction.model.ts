import { Anime, AnimeDetail } from "./anime.model";
import { UserProfile } from "./user-profile.model";

export interface MediaReaction {
  id: number;
  userId: string;
  animeId: number;
  libraryEntryId: number;
  anime: AnimeDetail;
  reaction: string;
  upvoteCount: number;
}

export interface MediaReactionWithUser extends MediaReaction {
  userProfile: UserProfile;
}

export interface MediaReactionTableRow {
  id: number;
  userId: string;
  reaction: string;
  upvoteCount: number;
  author?: string;
}