import { User } from "./user";

export interface LoginVariables {
  email: string;
  password: string;
}

export interface LoginResponse {
  login: {
    token: string;
    user: User;
  };
}
