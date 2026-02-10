import { GetMediaReactionsByUserItemResponse } from "./contracts/getMediaReactionByUserItemResponse.interface";
import { MediaReaction } from "./models/mediaReaction.model";

export function mapGetMediaReactionByUserItemResponseToMediaReaction(res: GetMediaReactionsByUserItemResponse): MediaReaction {
  return {
    id: res.id,
    userId: res.userId,
    anime: {
      id: res.animeId,
      title: res.animeTitle,
      imageUrl: res.animeImageUrl,
      categories: [],
      coverImageUrl: ""
    },
    animeId: res.animeId,
    reaction: res.reaction,
    libraryEntryId: res.libraryEntryId,
    upvoteCount: res.upvoteCount,
    dateCreated: res.dateCreated,
    dateUpdated: res.dateUpdated
  }
}