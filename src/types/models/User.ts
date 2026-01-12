export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  company?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserProfile {
  name: string;
  company?: string;
  avatar?: string;
}
