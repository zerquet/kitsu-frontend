import { Anime } from "../../../shared/models/anime.model";
import { MediaReaction } from "../../../shared/models/mediaReaction.model";
import { UserProfile } from "../../../shared/models/userProfile.model";

export interface GetLibraryEntryResponseDto {
  libraryEntryId: number;
  animeId: number;
  episodesWatched: number;
  watchStatus: string;
  userRating: number;
  anime: Anime;
  mediaReaction?: MediaReaction;
  userProfile: UserProfile;
}