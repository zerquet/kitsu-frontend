import { Anime } from "../../../shared/models/anime.model";
import { UserProfile } from "../../../shared/models/userProfile.model";

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