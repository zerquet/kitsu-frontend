import { Category } from "./category.model";
import { Franchise } from "./franchise.model";

export interface Anime {
  id: number;
  title: string;
  description?: string;
  score?: number;
  imageUrl: string;
  year?: number;
  mediaType?: string;
}

export interface AnimeDetail extends Anime {
  categories: Category[];
  releaseStatus?: string;
  coverImageId: string;
  episodeCount?: number;
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