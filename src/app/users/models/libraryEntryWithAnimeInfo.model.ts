export interface LibraryEntryWithAnimeInfo {
    id: number;
    animeId: number;
    title: string;
    imageUrl: string | null;
    totalEpisodes: number | null;
    watchStatus: string | null;
    userRating: number | null;
    episodesWatched: number;
}