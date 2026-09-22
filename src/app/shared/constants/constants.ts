import { UserRatingOption } from '../models/user-rating-option.model';

export const MAX_EPISODE_PROGRESS = 1500;
export const DEFAULT_USER_PROFILE = "https://kitsu.app/images/default_avatar-2ec3a4e2fc39a0de55bf42bf4822272a.png";
export const DEFAULT_USER_COVER = "https://kitsu.app/images/default_cover-22e5f56b17aeced6dc7f69c8d422a1ab.png";

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