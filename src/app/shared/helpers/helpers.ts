import { environment } from "../../../environments/environment";
import { DEFAULT_USER_COVER, DEFAULT_USER_PROFILE } from "../constants/constants";

export function getFileNameWithoutExtension(filename: string) {
  return filename.substring(0, filename.lastIndexOf("."));
}

export function getProfilePhotoUrl(profilePhotoId: string | undefined) {
  return profilePhotoId 
    ? `${environment.imageHostUrl}/users/profile/${profilePhotoId}.jpg` 
    : DEFAULT_USER_PROFILE;
}

export function getCoverPhotoUrl(coverPhotoId: string | undefined) {
  return coverPhotoId
    ? `${environment.imageHostUrl}/users/cover/${coverPhotoId}.jpg`
    : DEFAULT_USER_COVER;
}

export function formatBirthday(birthda: Date) {
  const birthday = new Date(birthda);
  const month = birthday.toLocaleString('default', { month: 'long' });
  const ordinalDay = getOrdinalDay(birthday.getUTCDate());
  return `${month} ${ordinalDay}`;
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