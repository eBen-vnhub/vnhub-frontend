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

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

export interface Workspace {
  id: number;
  company_name: string;
  company_country: string;
}

export interface User {
  id: string;
  email: string;
  companyName: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  mobileCountryCode?: string;
  mobileNumber?: string;
  role?: string;
  workspaces?: Workspace[];
  vendor_profile?: Vendor;
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
  nextStep: string;
  locations: string[];
  createdAt: string;
}

export interface Vendor {
  id: number;
  companyName: string;
  companyWebsite: string;
  companyCountry: string;
  businessCategory: string;
  businessTypeB2C?: boolean;
  businessTypeB2B?: boolean;
}

export interface InviteTeamMemberData {
  email: string;
  role: string;
}

export interface SubscriptionUpdateData {
  plan?: string;
  billingCycle?: string;
  locations?: string[];
}

export interface ApiSuccessResponse {
  success: boolean;
  message: string;
}
