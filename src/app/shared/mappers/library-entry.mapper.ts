import { CreateLibraryEntryResponseDto } from "../../features/anime/dtos/create-library-entry-response.dto";
import { GetLibraryEntryResponseDto } from "../../features/anime/dtos/get-library-entry-response.dto";
import { UpdateLibraryEntryResponseDto } from "../../features/anime/dtos/update-library-entry-response.dto";
import { GetLibraryResponseDto } from "../../features/user/dtos/get-library-response.dto";
import { LibraryEntry, LibraryEntryDetail, LibraryEntryWithUser } from "../models/library-entry.model";

export function mapGetLibraryToLibraryEntry(dto: GetLibraryResponseDto): LibraryEntryDetail {
  return {
    id: dto.id,
    animeId: dto.animeId,
    watchStatus: dto.watchStatus,
    episodesWatched: dto.episodesWatched,
    userRating: dto.userRating,
    anime: dto.anime,
    mediaReaction: dto.mediaReaction
  }
}

export function mapGetLibraryEntryToLibraryEntry(dto: GetLibraryEntryResponseDto): LibraryEntryWithUser {
  return {
    id: dto.libraryEntryId,
    animeId: dto.animeId,
    episodesWatched: dto.episodesWatched,
    watchStatus: dto.watchStatus,
    userRating: dto.userRating,
    anime: dto.anime,
    mediaReaction: dto.mediaReaction,
    userProfile: dto.userProfile
  }
}

export function mapCreateLibraryEntryToLibraryEntry(dto: CreateLibraryEntryResponseDto): LibraryEntry {
  return {
    id: dto.libraryEntryId,
    animeId: dto.animeId,
    episodesWatched: dto.episodesWatched,
    watchStatus: dto.watchStatus,
    userRating: dto.userRating
  }
}

export function mapUpdateLibraryEntryToLibraryEntry(dto: UpdateLibraryEntryResponseDto): LibraryEntry {
  return {
    id: dto.libraryEntryId,
    animeId: dto.animeId,
    episodesWatched: dto.episodesWatched,
    watchStatus: dto.watchStatus,
    userRating: dto.userRating
  }
}