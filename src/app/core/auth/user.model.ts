//User who is logged in
export interface CurrentUser {
  id: string;
  username: string;
  location: string;
  bio: string;
  birthday: Date | null;
  gender: string;
  email: string;
  profilePhotoId: string;
  coverPhotoId: string;
  isAdmin: boolean;
  token: string;
}
