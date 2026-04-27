/** UI-ready model for displaying user info */
export interface UserViewModel {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  isVerified: boolean;
}

/** UI-ready model for the current auth session */
export interface AuthSessionViewModel {
  token: string;
  user: UserViewModel;
}
