export interface GetMediaReactionByAnimeResponseDto {
  mediaReactionId: number;
  userId: string;
  reaction: string;
  upvoteCount: number;
  author?: string;
}