import { Role } from "./role.type";

export interface User {
    id: string;
    username: string;
    email: string;
    role: Role;
    verified: boolean;
    created_at: string;
  }
  

  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  }
  