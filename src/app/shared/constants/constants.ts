import { UserRatingOption } from '../models/user-rating-option.model';

export const MAX_EPISODE_PROGRESS = 1500;
export const DEFAULT_USER_PROFILE = "https://animetrackerstorage.blob.core.windows.net/images/default/default_avatar.png";
export const DEFAULT_USER_COVER = "https://animetrackerstorage.blob.core.windows.net/images/default/default_cover.png";
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

export const COLLECTION_SUMMARIES = {
  'highest-rated': 'Highest Rated',
  'new': 'Newly Released',
  'most-popular': 'Most Popular'
} as const;

export type CollectionKey = keyof typeof COLLECTION_SUMMARIES;

export function isCollectionKey(param: string): param is CollectionKey {
  return Object.hasOwn(COLLECTION_SUMMARIES, param);
}


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