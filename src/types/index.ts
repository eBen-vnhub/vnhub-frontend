export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SetPasswordData {
  token: string;
  email: string;
  password: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface User {
  id: string;
  email: string;
  companyName: string;
  firstName: string;
  lastName: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export interface Subscription {
  id: number;
  plan: string;
  billingCycle: string;
  status: string;
  startDate: string;
  amount: string;
  currency: string;
}

export interface Vendor {
  id: number;
  companyName: string;
  companyWebsite: string;
  companyCountry: string;
  businessCategory: string;
}
