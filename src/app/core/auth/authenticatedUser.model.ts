//User who is logged in
export interface AuthenticatedUser {
  id: string;
  username: string;
  displayId: string,
  location?: string;
  bio?: string;
  birthday?: Date;
  gender?: string;
  email: string;
  profilePhotoId?: string;
  coverPhotoId?: string;
  isAdmin: boolean;
  token: string;
}
