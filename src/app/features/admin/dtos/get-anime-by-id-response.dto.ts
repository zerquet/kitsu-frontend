import { Category } from "../../../shared/models/category.model";
import { Franchise } from "../../../shared/models/franchise.model";

/**
 * Admin only. Represents a single anime entry.
 */
export interface GetAnimeByIdResponseDto {
  id: number,
  title: string,
  description?: string,
  score?: number,
  releaseStatus?: string,
  imageUrl: string,
  year?: number,
  coverImageId: string,
  episodeCount?: number,
  mediaType?: string,
  englishTitle?: string,
  japaneseTitle?: string,
  japaneseTitleRomaji?: string,
  season?: string,
  startAirDate?: string,
  endAirDate?: string,
  tvRating?: string,
  episodeLength?: number,
  franchiseId?: number,
  franchise?: Franchise,
  categories: Category[],
}