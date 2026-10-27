export interface GetUserProfileResponseDto {
  id: string;
  displayId: string;
  username: string;
  location?: string;
  bio?: string;
  birthday?: string;
  gender?: string;
  profilePhotoId?: string;
  coverPhotoId?: string;
}