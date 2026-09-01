export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  hasApiKey: boolean;
}

export interface UpdateProfileRequest {
  fullName: string;
}

export interface ChangePasswordRequest {
  currentPassword?: string;
  newPassword?: string;
}
