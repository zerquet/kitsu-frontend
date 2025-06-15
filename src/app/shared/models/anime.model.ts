import { Category } from "./category.model";

export interface AnimeDetails {
    animeId: number;
    releaseStatus?: string;
    coverImageUrl: string;
    episodeCount?: number;
    mediaType?: string;
    englishTitle?: string;
    japaneseTitle?: string;
    japaneseTitleRomaji?: string;
    season?: string;
    startAirDate?: Date;
    endAirDate?: Date;
    tvRating?: string;
    episodeLength?: number;
    franchiseId?: number;
    franchiseName?: string;
}

export interface Anime {
    id: number;
    title: string;
    description?: string;
    imageUrl: string; 
    year?: number;
    score?: number;
    categories: Category[]; 
    details?: AnimeDetails;
}