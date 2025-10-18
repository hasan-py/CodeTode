import type { IUser } from "./user";

export interface IAuthState {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

export interface IAuthActions {
  login: (accessToken: string, userData: Partial<IUser> | null) => void;
  logout: () => void;
  updateUser: (user: Partial<IUser>) => void;
  setTokens: (accessToken: string) => void;
}
