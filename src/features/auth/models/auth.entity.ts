/** Domain model for an authenticated user */
export interface UserEntity {
  id: string;
  email: string;
  name: string;
  avatar: string;
  emailVisibility: boolean;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Domain model for an auth session */
export interface AuthSessionEntity {
  token: string;
  user: UserEntity;
}
