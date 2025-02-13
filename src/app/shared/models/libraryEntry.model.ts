export interface LibraryEntry {
    id: number;
    watchStatus: string | null;
    userRating: number | null;
    episodesWatched: number;
    animeInfo: AnimeInfo | null;
}

export interface AnimeInfo {
    animeId: number;
    title: string;
    imageUrl: string | null;
    episodeCount: number | null;
}