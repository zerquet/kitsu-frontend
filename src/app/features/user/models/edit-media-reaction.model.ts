export interface EditMediaReactionModel {
  mediaReactionId: number,
  userId: string | undefined,
  libraryEntryId: number | undefined,
  animeId: number | undefined,
  reaction: string | undefined,
  animeTitle: string | undefined,
  animeImageUrl: string | undefined,
}