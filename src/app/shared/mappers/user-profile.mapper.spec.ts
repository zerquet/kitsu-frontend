import { environment } from "../../../environments/environment";
import { GetUserProfileResponseDto } from "../../features/user/dtos/get-user-profile-response.dto";
import { DEFAULT_USER_COVER, DEFAULT_USER_PROFILE } from "../constants/constants";
import { mapGetUserProfileToUserProfile } from "./user-profile.mapper";

describe('user profile mapper', () => {
  const dto: GetUserProfileResponseDto = {
    id: 'user-1',
    displayId: 'spike',
    username: 'Spike'
  };

  it('hides the birthday and uses default photos when they are not set', () => {
    const profile = mapGetUserProfileToUserProfile(dto);

    expect(profile.birthdayPublic).toBe("It's a secret");
    expect(profile.profilePhotoUrl).toBe(DEFAULT_USER_PROFILE);
    expect(profile.coverPhotoUrl).toBe(DEFAULT_USER_COVER);
  });

  it('builds photo URLs and a readable birthday when they are set', () => {
    const profile = mapGetUserProfileToUserProfile({
      ...dto,
      birthday: '2000-06-26',
      profilePhotoId: 'pfp',
      coverPhotoId: 'cover'
    });

    expect(profile.birthdayPublic).toMatch(/ 26th$/);
    expect(profile.profilePhotoUrl).toBe(`${environment.imageHostUrl}/users/profile/pfp.jpg`);
    expect(profile.coverPhotoUrl).toBe(`${environment.imageHostUrl}/users/cover/cover.jpg`);
  });
});
