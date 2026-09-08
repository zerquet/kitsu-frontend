import { Anime } from "../../../shared/models/anime.model";
import { UserProfile } from "../../../shared/models/user-profile.model";
import { GetMediaReactionByUserResponseDto } from "../../user/dtos/get-media-reaction-by-user-response.dto";

export interface GetLibraryEntryResponseDto {
  libraryEntryId: number;
  animeId: number;
  episodesWatched: number;
  watchStatus: string;
  userRating: number;
  anime: Anime;
  mediaReaction?: GetMediaReactionByUserResponseDto;
  userProfile: UserProfile;
}