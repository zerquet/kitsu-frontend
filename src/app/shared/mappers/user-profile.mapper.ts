import { GetUserProfileResponseDto } from "../../features/user/dtos/get-user-profile-response.dto";
import { UpdateUserProfileResponseDto } from "../../features/user/dtos/update-user-profile-response.dto";
import { formatBirthday, getCoverPhotoUrl, getProfilePhotoUrl } from "../helpers/helpers";
import { UserProfile } from "../models/user-profile.model";

export function mapGetUserProfileToUserProfile(dto: GetUserProfileResponseDto): UserProfile {
  return {
    id:  dto.id,
    username: dto.username,
    displayId: dto.displayId,
    location: dto.location,
    bio: dto.bio,
    birthday: dto.birthday,
    birthdayPublic: dto.birthday ? formatBirthday(dto.birthday) : "It's a secret",
    gender: dto.gender,
    profilePhotoId: dto.profilePhotoId,
    profilePhotoUrl: getProfilePhotoUrl(dto.profilePhotoId),
    coverPhotoId: dto.coverPhotoId,
    coverPhotoUrl: getCoverPhotoUrl(dto.coverPhotoId)
  }
}

export function mapUpdateUserProfileToUserProfile(dto: UpdateUserProfileResponseDto): UserProfile {
  return {
    id:  dto.id,
    username: dto.username,
    displayId: dto.displayId,
    location: dto.location,
    bio: dto.bio,
    birthday: dto.birthday,
    birthdayPublic: dto.birthday ? formatBirthday(dto.birthday) : "It's a secret",
    gender: dto.gender,
    profilePhotoId: dto.profilePhotoId,
    profilePhotoUrl: getProfilePhotoUrl(dto.profilePhotoId),
    coverPhotoId: dto.coverPhotoId,
    coverPhotoUrl: getCoverPhotoUrl(dto.coverPhotoId)
  }
}