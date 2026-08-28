export interface User {
  id: string;
  email: string;
  fullName: string;
  currentPlan: string;
  auditsUsedThisMonth: number;
  totalAuditsAllowed: number;
  subscriptionExpiry: Date | null;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  companyName?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
