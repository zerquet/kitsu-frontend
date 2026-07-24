import { MediaReaction } from "../../../shared/models/mediaReaction.model";

export interface GetLibraryEntryResponseDto {
  libraryEntryId: number;
  animeId: number;
  episodesWatched: number;
  watchStatus: string;
  userRating: number;
  mediaReaction?: MediaReaction;
}