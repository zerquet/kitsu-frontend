export interface AddMediaReactionResponseDto {
  id: number;
  userId: string;
  libraryEntryId: number;
  animeId: number;
  reaction: string;
  upvoteCount: number;
  animeTitle: string;
  animeYear: number;
  animeMediaType: string;
  animeImageUrl: string;
}