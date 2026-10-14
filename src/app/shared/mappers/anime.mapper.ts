import { GetAnimeByIdResponseDto } from "../../features/anime/dtos/get-anime-by-id-response.dto";
import { AnimeSearchResultResponseDto, GetExploreAnimeResponseDto } from "../../features/anime/dtos/get-explore-anime-response.dto";
import { AnimePageModel } from "../../features/anime/models/anime-page.model";
import { ExplorePageModel } from "../../features/anime/models/explore-page.model";
import { getAnimePosterUrl } from "../helpers/helpers";
import { Anime } from "../models/anime.model";

export function mapGetExploreAnimeToExplorePage(dto: GetExploreAnimeResponseDto): ExplorePageModel {
  return {
    highestRatedAnime: dto.highestRatedAnime.map(a => ({...a, imageUrl: getAnimePosterUrl(a.imageUrl)})),
    newAnime: dto.newAnime.map(a => ({...a, imageUrl: getAnimePosterUrl(a.imageUrl)})),
    popularAnime: dto.popularAnime.map(a => ({...a, imageUrl: getAnimePosterUrl(a.imageUrl)}))
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