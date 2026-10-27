//base user class
export interface User {
  id: string;
  username: string;
  displayId: string;
  location?: string;
  bio?: string;
  birthday?: string;
  gender?: string;
  profilePhotoId?: string;
  profilePhotoUrl: string;
  coverPhotoId?: string;
  coverPhotoUrl: string;
}

//User whose profile is currently being viewed
export interface UserProfile extends User {
  birthdayPublic: string;
}