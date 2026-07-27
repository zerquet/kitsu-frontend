import { Anime } from "../../../shared/models/anime.model";
import { MediaReaction } from "../../../shared/models/mediaReaction.model";

export interface GetLibraryResponseDto {
  id: number;
  displayId?: string; //needed??
  animeId: number;
  watchStatus?: string;
  episodesWatched: number;
  userRating?: number;
  anime: Anime;
  mediaReaction?: MediaReaction;
}