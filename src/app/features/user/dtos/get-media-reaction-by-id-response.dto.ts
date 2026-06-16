import { UserProfile } from "../../../shared/models/userProfile.model";

export interface GetMediaReactionByIdResponseDto {
  id: number;
  userId: string;
  libraryEntryId: number;
  animeId: number;
  reaction: string;
  upvoteCount: number;
  animeTitle: string;
  animeYear: number;
  animeMediaType: string;
  animeImageUrl: string;
  userProfile: UserProfile
}