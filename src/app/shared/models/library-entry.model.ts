import { Anime } from "./anime.model";
import { MediaReaction } from "./mediaReaction.model";
import { UserProfile } from "./userProfile.model";

export interface LibraryEntry {
  id: number;
  displayId?: string;
  animeId: number;
  watchStatus?: string;
  userRating?: number;
  episodesWatched: number;
  mediaReaction?: MediaReaction;
}

export interface LibraryEntryDetail extends LibraryEntry {
  anime: Anime;
}

export interface LibraryEntryWithUser extends LibraryEntryDetail {
  userProfile: UserProfile;
}