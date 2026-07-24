import { MAX_EPISODE_PROGRESS } from "../constants/constants";

export function progressIsValid(progress: number, animeEpisodeCount: number | undefined) {
  //If anime has no episode count (e.g. One Piece)
  if (!animeEpisodeCount)
    return progress >= 0 && progress <= MAX_EPISODE_PROGRESS;

  return progress >= 0 && progress <= MAX_EPISODE_PROGRESS && progress <= animeEpisodeCount;
}