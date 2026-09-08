//User whose profile is currently being viewed
export interface UserProfile {
  id: string;
  username: string;
  displayId: string;
  location?: string;
  bio?: string;
  birthday?: Date;
  birthdayPublic: string;
  gender?: string;
  profilePhotoId?: string;
  profilePhotoUrl: string;
  coverPhotoId?: string;
  coverPhotoUrl: string;
}