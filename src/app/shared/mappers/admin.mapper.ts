import { AddAnimeResponseDto } from "../../features/admin/dtos/add-anime-response.dto";
import { AnimeTableResponseItemDto } from "../../features/admin/dtos/anime-table-response-item.dto";
import { GetAnimeByIdResponseDto } from "../../features/admin/dtos/get-anime-by-id-response.dto";
import { UpdateAnimeResponseDto } from "../../features/admin/dtos/update-anime-response.dto";
import { AnimeTableItem } from "../../features/admin/models/anime-table-item.model";
import { getAnimeCoverUrl, getAnimePosterUrl } from "../helpers/helpers";
import { AnimeDetail } from "../models/anime.model";

/**
 * Admin mapper for a DTO to AnimeDetail object
 */
export function mapGetAnimeByIdToAnimeDetail(dto: GetAnimeByIdResponseDto): AnimeDetail {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    score: dto.score,
    imageUrl: getAnimePosterUrl(dto.imageUrl),
    year: dto.year,
    mediaType: dto.mediaType,
    categories: dto.categories,
    releaseStatus: dto.releaseStatus,
    coverImageId: getAnimeCoverUrl(dto.coverImageId),
    episodeCount: dto.episodeCount,
    englishTitle: dto.englishTitle,
    japaneseTitle: dto.japaneseTitle,
    japaneseTitleRomaji: dto.japaneseTitleRomaji,
    season: dto.season,
    startAirDate: dto.startAirDate,
    endAirDate: dto.endAirDate,
    tvRating: dto.tvRating,
    episodeLength: dto.episodeLength,
    franchiseId: dto.franchiseId,
    franchise: dto.franchise,
  }
}

export function mapAnimeTableResponseItemToAnimeTableItem(dto: AnimeTableResponseItemDto): AnimeTableItem {
  return {
    id: dto.id,
    title: dto.title,
    score: dto.score,
    releaseStatus: dto.releaseStatus,
    imageUrl: getAnimePosterUrl(dto.imageUrl),
    year: dto.year,
    episodeCount: dto.episodeCount,
    mediaType: dto.mediaType,
  }
}

export function mapUpdateAnimeToAnimeTableItem(dto: UpdateAnimeResponseDto): AnimeTableItem {
  return {
    id: dto.id,
    title: dto.title,
    score: dto.score,
    releaseStatus: dto.releaseStatus,
    imageUrl: getAnimePosterUrl(dto.imageUrl),
    year: dto.year,
    episodeCount: dto.episodeCount,
    mediaType: dto.mediaType,
  }
}

export function mapAddAnimeToAnimeTableItem(dto: AddAnimeResponseDto): AnimeTableItem {
  return {
    id: dto.id,
    title: dto.title,
    score: dto.score,
    releaseStatus: dto.releaseStatus,
    imageUrl: getAnimePosterUrl(dto.imageUrl),
    year: dto.year,
    episodeCount: dto.episodeCount,
    mediaType: dto.mediaType
  }
}