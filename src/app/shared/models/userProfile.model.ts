//User whose profile is currently being viewed
export interface UserProfile {
  id: string;
  username: string;
  displayId: string;
  location?: string;
  bio?: string;
  birthday?: Date;
  gender?: string;
  profilePhotoId?: string;
  coverPhotoId?: string;
}