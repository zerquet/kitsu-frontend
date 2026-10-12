import { Anime, AnimeDetail } from "../../../shared/models/anime.model";

export interface GetMediaReactionByUserResponseDto {
  mediaReactionId: number;
  userId: string;
  libraryEntryId: number;
  animeId: number;
  reaction: string;
  upvoteCount: number;
  anime: AnimeDetail;
}