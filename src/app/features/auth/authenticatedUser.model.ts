//User who is logged in
export interface AuthenticatedUser {
  id: string;
  userName: string;
  displayId: string,
  location?: string;
  bio?: string;
  birthday?: Date;
  gender?: string;
  email: string;
  profilePhotoId?: string;
  profilePhotoUrl: string;
  coverPhotoId?: string;
  coverPhotoUrl: string;
  isAdmin: boolean; //frontend-only property
}
