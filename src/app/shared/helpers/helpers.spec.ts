import { environment } from "../../../environments/environment";
import { DEFAULT_USER_COVER, DEFAULT_USER_PROFILE } from "../constants/constants";
import {
  formatBirthday,
  getAnimeCoverUrl,
  getAnimePosterUrl,
  getCoverPhotoUrl,
  getFileNameWithoutExtension,
  getOrdinalDay,
  getProfilePhotoUrl
} from "./helpers";

describe('helpers', () => {
  describe('getOrdinalDay', () => {
    it('uses st/nd/rd for days ending in 1, 2 and 3', () => {
      expect(getOrdinalDay(1)).toBe('1st');
      expect(getOrdinalDay(2)).toBe('2nd');
      expect(getOrdinalDay(3)).toBe('3rd');
      expect(getOrdinalDay(21)).toBe('21st');
      expect(getOrdinalDay(22)).toBe('22nd');
      expect(getOrdinalDay(23)).toBe('23rd');
      expect(getOrdinalDay(31)).toBe('31st');
    });

    it('uses th for the teens', () => {
      expect(getOrdinalDay(11)).toBe('11th');
      expect(getOrdinalDay(12)).toBe('12th');
      expect(getOrdinalDay(13)).toBe('13th');
    });

    it('uses th for everything else', () => {
      expect(getOrdinalDay(4)).toBe('4th');
      expect(getOrdinalDay(20)).toBe('20th');
      expect(getOrdinalDay(30)).toBe('30th');
    });
  });

  describe('formatBirthday', () => {
    const monthName = (year: number, monthIndex: number) =>
      new Date(Date.UTC(year, monthIndex, 1)).toLocaleString('default', { month: 'long', timeZone: 'UTC' });

    it('formats a DateOnly string as month and ordinal day', () => {
      expect(formatBirthday('2002-10-12')).toBe(`${monthName(2002, 9)} 12th`);
    });

    it('does not shift the month on the first of the month', () => {
      // DateOnly strings parse as UTC midnight; in timezones behind UTC the local month is the previous one
      expect(formatBirthday('2000-03-01')).toBe(`${monthName(2000, 2)} 1st`);
    });
  });

  describe('photo URLs', () => {
    it('builds profile and cover photo URLs from an id', () => {
      expect(getProfilePhotoUrl('abc')).toBe(`${environment.imageHostUrl}/users/profile/abc.jpg`);
      expect(getCoverPhotoUrl('abc')).toBe(`${environment.imageHostUrl}/users/cover/abc.jpg`);
    });

    it('falls back to defaults when there is no id', () => {
      expect(getProfilePhotoUrl(undefined)).toBe(DEFAULT_USER_PROFILE);
      expect(getProfilePhotoUrl('')).toBe(DEFAULT_USER_PROFILE);
      expect(getCoverPhotoUrl(undefined)).toBe(DEFAULT_USER_COVER);
    });

    it('builds anime poster and cover URLs', () => {
      expect(getAnimePosterUrl('poster.jpg')).toBe(`${environment.imageHostUrl}/anime/poster/poster.jpg`);
      expect(getAnimeCoverUrl('cover.jpg')).toBe(`${environment.imageHostUrl}/anime/cover/cover.jpg`);
      expect(getAnimeCoverUrl(undefined)).toBe(DEFAULT_USER_COVER);
    });
  });

  describe('getFileNameWithoutExtension', () => {
    it('strips only the last extension', () => {
      expect(getFileNameWithoutExtension('photo.jpg')).toBe('photo');
      expect(getFileNameWithoutExtension('my.photo.png')).toBe('my.photo');
    });
  });
});
