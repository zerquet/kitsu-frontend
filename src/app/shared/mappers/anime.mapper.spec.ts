import { environment } from "../../../environments/environment";
import { AnimeResponseItemDto, GetExploreAnimeResponseDto } from "../../features/anime/dtos/get-explore-anime-response.dto";
import { mapAnimeResponseItemToAnime, mapGetExploreAnimeToExplorePage, mapSearchResultToAnime } from "./anime.mapper";

describe('anime mapper', () => {
  const dto: AnimeResponseItemDto = {
    id: 1,
    title: 'Cowboy Bebop',
    description: 'Space bounty hunters.',
    score: 8.8,
    imageUrl: 'bebop.jpg',
    year: 1998
  };

  it('maps a response item and expands the poster file name into a full URL', () => {
    expect(mapAnimeResponseItemToAnime(dto)).toEqual({
      id: 1,
      title: 'Cowboy Bebop',
      description: 'Space bounty hunters.',
      score: 8.8,
      imageUrl: `${environment.imageHostUrl}/anime/poster/bebop.jpg`,
      year: 1998
    });
  });

  it('maps a search result the same way', () => {
    expect(mapSearchResultToAnime(dto)).toEqual(mapAnimeResponseItemToAnime(dto));
  });

  it('maps every list on the explore page', () => {
    const exploreDto: GetExploreAnimeResponseDto = {
      highestRatedAnime: [dto],
      newAnime: [{ ...dto, id: 2 }],
      popularAnime: []
    };

    const result = mapGetExploreAnimeToExplorePage(exploreDto);

    expect(result.highestRatedAnime.map(a => a.id)).toEqual([1]);
    expect(result.newAnime.map(a => a.id)).toEqual([2]);
    expect(result.popularAnime).toEqual([]);
  });
});
