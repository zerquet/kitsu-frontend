import { GetMediaReactionByAnimeResponseDto } from "../../features/anime/dtos/get-media-reaction-by-anime-response.dto";
import { AddMediaReactionResponseDto } from "../../features/user/dtos/add-media-reaction-response.dto";
import { GetMediaReactionByIdResponseDto } from "../../features/user/dtos/get-media-reaction-by-id-response.dto";
import { GetMediaReactionByUserResponseDto } from "../../features/user/dtos/get-media-reaction-by-user-response.dto";
import { UpdateMediaReactionResponseDto } from "../../features/user/dtos/update-media-reaction-response.dto";
import { MediaReaction, MediaReactionTableRow, MediaReactionWithUser } from "../models/media-reaction.model";
import { mapGetUserProfileToUserProfile } from "./user-profile.mapper";

export function mapGetMediaReactionByIdToMediaReaction(dto: GetMediaReactionByIdResponseDto) : MediaReactionWithUser {
  return {
    id: dto.mediaReactionId,
    userId: dto.userId,
    animeId: dto.animeId,
    libraryEntryId: dto.libraryEntryId,
    reaction: dto.reaction,
    upvoteCount: dto.upvoteCount,
    anime: dto.anime, 
    userProfile: mapGetUserProfileToUserProfile(dto.userProfile)
  }
}

export function mapGetMediaReactionByUserToMediaReaction(dto: GetMediaReactionByUserResponseDto): MediaReaction {
  return {
    id: dto.mediaReactionId,
    userId: dto.userId,
    animeId: dto.animeId,
    anime: dto.anime,
    reaction: dto.reaction,
    libraryEntryId: dto.libraryEntryId,
    upvoteCount: dto.upvoteCount
  }
}

export function mapAddMediaReactionToMediaReaction(dto: AddMediaReactionResponseDto): MediaReaction {
  return {
    id: dto.mediaReactionId,
    userId: dto.userId,
    animeId: dto.animeId,
    libraryEntryId: dto.libraryEntryId,
    anime: dto.anime,
    reaction: dto.reaction,
    upvoteCount: dto.upvoteCount
  }
}

export function mapUpdateMediaReactionToMediaReaction(dto: UpdateMediaReactionResponseDto): MediaReaction {
  return {
    id: dto.mediaReactionId,
    userId: dto.userId,
    animeId: dto.animeId,
    libraryEntryId: dto.libraryEntryId,
    anime: dto.anime,
    reaction: dto.reaction,
    upvoteCount: dto.upvoteCount
  }
}

export function mapGetMediaReactionByAnimeToMediaReaction(dto: GetMediaReactionByAnimeResponseDto): MediaReactionTableRow {
  return {
    id: dto.mediaReactionId,
    userId: dto.userId,
    reaction: dto.reaction,
    upvoteCount: dto.upvoteCount,
    author: dto.author
  }
}