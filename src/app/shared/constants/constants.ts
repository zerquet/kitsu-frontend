import { UserRatingOption } from '../models/user-rating-option.model';

export const MAX_EPISODE_PROGRESS = 1500;
export const DEFAULT_USER_PROFILE = "https://kitsu.app/images/default_avatar-2ec3a4e2fc39a0de55bf42bf4822272a.png";
export const DEFAULT_USER_COVER = "https://kitsu.app/images/default_cover-22e5f56b17aeced6dc7f69c8d422a1ab.png";
//Default constants for /search
export const DEFAULT_MIN_RATING = '5';
export const DEFAULT_MAX_RATING = '100';
export const DEFAULT_MIN_YEAR = '1990';
export const DEFAULT_MAX_YEAR = '2027';
export const DEFAULT_MIN_EPS = '1';
export const DEFAULT_MAX_EPS = '100';
export const DEFAULT_IS_TV = false;
export const DEFAULT_IS_MOVIE = false;
export const DEFAULT_SORT_OPTION = 'Title';


export const RATING_OPTIONS: UserRatingOption[] = [
  {
    userRating: 1,
    ratingLabel: 'Awful',
    colorClass: 'rating-awful',
    iconClass: 'bi bi-emoji-frown-fill'
  },
  {
    userRating: 2,
    ratingLabel: 'Meh',
    colorClass: 'rating-meh',
    iconClass: 'bi bi-emoji-neutral-fill'
  },
  {
    userRating: 3,
    ratingLabel: 'Good',
    colorClass: 'rating-good',
    iconClass: 'bi bi-emoji-smile-fill'
  },
  {
    userRating: 4,
    ratingLabel: 'Great',
    colorClass: 'rating-great',
    iconClass: 'bi bi-emoji-laughing-fill'
  }
];