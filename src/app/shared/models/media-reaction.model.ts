import { Anime } from "./anime.model";
import { UserProfile } from "./user-profile.model";

export interface MediaReaction {
  id: number;
  userId: string;
  animeId: number;
  libraryEntryId: number;
  anime: Anime;
  reaction: string;
  upvoteCount: number;
}

export interface MediaReactionWithUser extends MediaReaction {
  userProfile: UserProfile;
}