export interface UserResponse {
  id: string;
  birthDate: string;
  email: string;
}

export interface UserRequest {
  userId: string;
  email: string;
  birthDate: string;
  gender: string;
}
