// Raw shapes returned by PocketBase — never modify, just map.

/** PocketBase user record shape */
export interface UserRecordDto {
  id: string;
  collectionId: string;
  collectionName: string;
  email: string;
  emailVisibility: boolean;
  name: string;
  avatar: string;
  verified: boolean;
  created: string;
  updated: string;
}

/** Returned by auth-with-password and auth-refresh */
export interface AuthResponseDto {
  token: string;
  record: UserRecordDto;
}

/** Returned by record creation (signup) */
export type SignupResponseDto = UserRecordDto;
