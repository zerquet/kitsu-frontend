import { GetAnimeByIdResponseDto } from "../../features/anime/dtos/get-anime-by-id-response.dto";
import { AnimeResponseItemDto, AnimeSearchResultResponseDto, GetExploreAnimeResponseDto } from "../../features/anime/dtos/get-explore-anime-response.dto";
import { AnimePageModel } from "../../features/anime/models/anime-page.model";
import { ExplorePageModel } from "../../features/anime/models/explore-page.model";
import { getAnimePosterUrl } from "../helpers/helpers";
import { Anime } from "../models/anime.model";

export function mapGetExploreAnimeToExplorePage(dto: GetExploreAnimeResponseDto): ExplorePageModel {
  return {
    highestRatedAnime: dto.highestRatedAnime.map(mapAnimeResponseItemToAnime),
    newAnime: dto.newAnime.map(mapAnimeResponseItemToAnime),
    popularAnime: dto.popularAnime.map(mapAnimeResponseItemToAnime)
  };
}

export function mapSearchResultToAnime(dto: AnimeSearchResultResponseDto): Anime {
  return {
    id: dto.id,
    title: dto.title,
    imageUrl: getAnimePosterUrl(dto.imageUrl),
    description: dto.description,
    score: dto.score,
    year: dto.year
  }
}

export function mapGetAnimeByIdToAnimePage(dto: GetAnimeByIdResponseDto): AnimePageModel {
  return {
    anime: dto.anime,
    isFavorite: dto.isFavorite
  }
}

export function mapAnimeResponseItemToAnime(dto: AnimeResponseItemDto): Anime {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    score: dto.score,
    imageUrl: getAnimePosterUrl(dto.imageUrl),
    year: dto.year,
  }
}