import { Category } from "./category.model";

export interface AnimeDetails {
    animeId: number;
    releaseStatus: string | null;
    coverImageUrl: string;
    episodeCount: number | null;
    mediaType: string | null;
    englishTitle: string | null;
    japaneseTitle: string | null;
    japaneseTitleRomaji: string | null;
    season: string | null;
    startAirDate: Date | null;
    endAirDate: Date | null;
    tvRating: string | null;
    episodeLength: number | null;
    franchiseId: number | null;
    franchiseName: string | null;
}

export interface Anime {
    id: number;
    title: string;
    description: string | null;
    imageUrl: string; 
    year: number | null;
    score: number | null;
    categories: Category[]; 
    details: AnimeDetails;
}