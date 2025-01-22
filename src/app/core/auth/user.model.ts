export interface User {
    //NewUserDto in backend
    id: number;
    username: string;
    email: string;
    token: string;
    isAdmin: boolean;
}