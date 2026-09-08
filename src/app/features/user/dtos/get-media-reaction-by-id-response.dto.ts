import { Anime } from "../../../shared/models/anime.model";
import { GetUserProfileResponseDto } from "./get-user-profile-response.dto";

export interface GetMediaReactionByIdResponseDto {
  mediaReactionId: number;
  userId: string;
  libraryEntryId: number;
  animeId: number;
  reaction: string;
  upvoteCount: number;
  anime: Anime;
  userProfile: GetUserProfileResponseDto
}