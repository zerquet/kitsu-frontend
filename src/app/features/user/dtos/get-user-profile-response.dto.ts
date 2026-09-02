export interface GetUserProfileResponseDto {
  id: string;
  displayId: string;
  username: string;
  location?: string;
  bio?: string;
  birthday?: Date;
  gender?: string;
  profilePhotoId?: string;
  coverPhotoId?: string;
}