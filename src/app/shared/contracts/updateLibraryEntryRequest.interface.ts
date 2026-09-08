export interface UpdateLibraryEntryRequest {
  libraryEntryId: number;
  watchStatus?: string;
  userRating?: number;
  episodesWatched: number;
}