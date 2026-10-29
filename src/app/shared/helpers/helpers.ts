import { environment } from "../../../environments/environment";
import { DEFAULT_USER_COVER, DEFAULT_USER_PROFILE } from "../constants/constants";

export function getFileNameWithoutExtension(filename: string) {
  return filename.substring(0, filename.lastIndexOf("."));
}

export function getProfilePhotoUrl(profilePhotoId: string | undefined) {
  return profilePhotoId 
    ? `${environment.imageHostUrl}/users/profile/${profilePhotoId}` 
    : DEFAULT_USER_PROFILE;
}

export function getCoverPhotoUrl(coverPhotoId: string | undefined) {
  return coverPhotoId
    ? `${environment.imageHostUrl}/users/cover/${coverPhotoId}`
    : DEFAULT_USER_COVER;
}

export function getAnimePosterUrl(posterImgFileName: string | undefined) {
  //anime poster should not be optional...?
  return `${environment.imageHostUrl}/anime/poster/${posterImgFileName}`;
}

export function getAnimeCoverUrl(animeCoverImgFileName: string | undefined) {
  return animeCoverImgFileName
    ? `${environment.imageHostUrl}/anime/cover/${animeCoverImgFileName}`
    : DEFAULT_USER_COVER;
}

export function formatBirthday(birthdate: string) {
  const birthday = new Date(birthdate);
  const month = birthday.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
  const ordinalDay = getOrdinalDay(birthday.getUTCDate());
  return `${month} ${ordinalDay}`;
}

// Converts an API date to the YYYY-MM-DD value a native date input expects.
// API dates arrive as ISO strings at runtime even where models type them as Date.
export function toDateInputValue(date: Date | string | null | undefined): string | null {
  if (!date) {
    return null;
  }

  if (typeof date === 'string') {
    return date.substring(0, 10);
  }

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function getOrdinalDay(day: number) {
  if (day > 3 && day < 21) {
    return `${day}th`;
  }

  switch(day % 10) {
    case 1: 
      return `${day}st`;
    case 2: 
      return `${day}nd`;
    case 3: 
      return `${day}rd`;
    default:
      return `${day}th`
  }
}