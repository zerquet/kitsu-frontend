import { GetExploreAnimeResponseDto } from "../../features/anime/dtos/get-explore-anime-response.dto";
import { ExplorePageModel } from "../../features/anime/models/explore-page.model";
import { getAnimePosterUrl } from "../helpers/helpers";
import { Anime } from "../models/anime.model";

export function mapGetExploreAnimeToExplore(dto: GetExploreAnimeResponseDto): ExplorePageModel {
  return {
    highestRatedAnime: dto.highestRatedAnime.map(a => ({...a, imageUrl: getAnimePosterUrl(a.imageUrl)})),
    newAnime: dto.newAnime.map(a => ({...a, imageUrl: getAnimePosterUrl(a.imageUrl)})),
    popularAnime: dto.popularAnime.map(a => ({...a, imageUrl: getAnimePosterUrl(a.imageUrl)}))
  };
}