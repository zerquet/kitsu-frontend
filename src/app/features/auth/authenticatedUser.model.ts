import { User } from "../../shared/models/user-profile.model";

//User who is logged in
export interface AuthenticatedUser extends User {
  email: string;
  isAdmin: boolean; //frontend-only property
}
