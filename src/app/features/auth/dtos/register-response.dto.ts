export interface RegisterResponseDto {
  userId: string, 
  displayId: string, 
  username: string, 
  email: string, 
  isAdmin: boolean, 
  token: string, 
  isSuccess: boolean,
  error: string
}