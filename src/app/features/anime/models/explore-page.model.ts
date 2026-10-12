import { Anime } from "../../../shared/models/anime.model";

export interface ExplorePageModel {
    highestRatedAnime: Anime[],
    newAnime: Anime[],
    popularAnime: Anime[]
}