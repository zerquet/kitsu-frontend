import { CreateLibraryEntryResponseDto } from "../../features/anime/dtos/create-library-entry-response.dto";
import { GetLibraryEntryResponseDto } from "../../features/anime/dtos/get-library-entry-response.dto";
import { UpdateLibraryEntryResponseDto } from "../../features/anime/dtos/update-library-entry-response.dto";
import { GetLibraryResponseDto } from "../../features/user/dtos/get-library-response.dto";
import { LibraryEntry, LibraryEntryDetail, LibraryEntryWithUser } from "../models/library-entry.model";
import { mapGetMediaReactionByUserToMediaReaction } from "./media-reaction.mapper";

export function mapGetLibraryToLibraryEntry(dto: GetLibraryResponseDto): LibraryEntryDetail {
  return {
    id: dto.libraryEntryId,
    animeId: dto.animeId,
    watchStatus: dto.watchStatus,
    episodesWatched: dto.episodesWatched,
    userRating: dto.userRating,
    anime: dto.anime,
    mediaReaction: dto.mediaReaction ? mapGetMediaReactionByUserToMediaReaction(dto.mediaReaction) : undefined
  }
}

export function mapGetLibraryEntryToLibraryEntry(dto: GetLibraryEntryResponseDto): LibraryEntryDetail {
  return {
    id: dto.libraryEntryId,
    animeId: dto.animeId,
    episodesWatched: dto.episodesWatched,
    watchStatus: dto.watchStatus,
    userRating: dto.userRating,
    anime: dto.anime,
    mediaReaction: dto.mediaReaction ? mapGetMediaReactionByUserToMediaReaction(dto.mediaReaction) : undefined,
  }
}

export function mapCreateLibraryEntryToLibraryEntry(dto: CreateLibraryEntryResponseDto): LibraryEntryDetail {
  return {
    id: dto.libraryEntryId,
    animeId: dto.animeId,
    episodesWatched: dto.episodesWatched,
    watchStatus: dto.watchStatus,
    userRating: dto.userRating,
    anime: dto.anime,
    mediaReaction: dto.mediaReaction ? mapGetMediaReactionByUserToMediaReaction(dto.mediaReaction) : undefined
  }
}

export function mapUpdateLibraryEntryToLibraryEntry(dto: UpdateLibraryEntryResponseDto): LibraryEntryDetail {
  return {
    id: dto.libraryEntryId,
    animeId: dto.animeId,
    episodesWatched: dto.episodesWatched,
    watchStatus: dto.watchStatus,
    userRating: dto.userRating,
    anime: dto.anime,
    mediaReaction: dto.mediaReaction ? mapGetMediaReactionByUserToMediaReaction(dto.mediaReaction) : undefined
  }
}