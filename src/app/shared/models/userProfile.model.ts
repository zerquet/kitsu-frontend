export interface UserProfile {
  id: string;
  username: string;
  location: string;
  bio: string;
  birthday: Date | null;
  gender: string;
  profilePhotoId: string;
  coverPhotoId: string;
}