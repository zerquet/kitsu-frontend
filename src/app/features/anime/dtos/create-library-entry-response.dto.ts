import { Anime } from "../../../shared/models/anime.model";
import { GetMediaReactionByUserResponseDto } from "../../user/dtos/get-media-reaction-by-user-response.dto";

export interface CreateLibraryEntryResponseDto {
  libraryEntryId: number;
  animeId: number;
  episodesWatched: number;
  watchStatus: string;
  userRating: number;
  anime: Anime;
  mediaReaction?: GetMediaReactionByUserResponseDto;
}