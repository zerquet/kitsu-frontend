//User whose profile is currently being viewed
export interface UserProfile {
  id: string;
  displayId: string;
  username: string;
  location: string;
  bio: string;
  birthday: Date | null;
  gender: string;
  profilePhotoId: string;
  coverPhotoId: string;
}