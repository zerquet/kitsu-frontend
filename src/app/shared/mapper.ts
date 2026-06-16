import { GetMediaReactionByIdResponseDto } from "../features/user/dtos/get-media-reaction-by-id-response.dto";
import { MediaReaction } from "./models/mediaReaction.model";

// export function mapGetMediaReactionByUserItemResponseToMediaReaction(res: GetMediaReactionsByIdResponseDto): MediaReaction {
//   return {
//     id: res.id,
//     userId: res.userId,
//     anime: {
//       id: res.animeId,
//       title: res.animeTitle,
//       imageUrl: res.animeImageUrl,
//       categories: [],
//       coverImageId: ""
//     },
//     animeId: res.animeId,
//     reaction: res.reaction,
//     libraryEntryId: res.libraryEntryId,
//     upvoteCount: res.upvoteCount,
//     dateCreated: res.dateCreated,
//     dateUpdated: res.dateUpdated
//   }
// }