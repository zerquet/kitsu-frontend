import { Category } from "./category.model";
import { Franchise } from "./franchise.model";

export interface Anime {
    id: number;
    title: string;
    description?: string;
    score?: number;
    categories: Category[]; 
    releaseStatus?: string;
    imageUrl: string; 
    year?: number;
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
    franchise?: Franchise;
    //add the rest?
}