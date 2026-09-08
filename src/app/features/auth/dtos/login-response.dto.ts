import { AuthenticatedUser } from "../authenticatedUser.model";

export interface LoginResponseDto {
  user?: AuthenticatedUser;
  success: boolean;
  errorMessage: string;
  token: string;
  isAdmin: boolean;
}