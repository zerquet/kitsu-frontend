import { Anime } from "../../../shared/models/anime.model";
import { UserProfile } from "../../../shared/models/user-profile.model";

export interface GetMediaReactionByIdResponseDto {
  mediaReactionId: number;
  userId: string;
  libraryEntryId: number;
  animeId: number;
  reaction: string;
  upvoteCount: number;
  anime: Anime;
  userProfile: UserProfile
}