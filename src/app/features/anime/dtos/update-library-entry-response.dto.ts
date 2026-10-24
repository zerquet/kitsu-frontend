import { Anime, AnimeDetail } from "../../../shared/models/anime.model";
import { GetMediaReactionByUserResponseDto } from "../../user/dtos/get-media-reaction-by-user-response.dto";

export interface UpdateLibraryEntryResponseDto {
  libraryEntryId: number;
  animeId: number;
  episodesWatched: number;
  watchStatus: string;
  userRating: number;
  anime: AnimeDetail;
  mediaReaction?: GetMediaReactionByUserResponseDto;
}