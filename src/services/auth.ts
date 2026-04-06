import type { LoginCredentials, SetPasswordData, ResetPasswordData, ForgotPasswordData, ChangePasswordData } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw { response: { data }, status: response.status };
  }

  return data;
}

const authService = {
  login: (credentials: LoginCredentials) =>
    request<{ user: { id: string; email: string; companyName: string; firstName: string; lastName: string } }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  logout: () =>
    request<{ success: boolean }>('/auth/logout/', {
      method: 'POST',
    }),

  me: () =>
    request<{ user: { id: string; email: string; companyName: string; firstName: string; lastName: string } }>('/auth/me/'),

  forgotPassword: (email: string) =>
    request<{ success: boolean; message: string }>('/auth/forgot-password/', {
      method: 'POST',
      body: JSON.stringify({ email } as ForgotPasswordData),
    }),

  resetPassword: (data: ResetPasswordData) =>
    request<{ success: boolean; message: string }>('/auth/reset-password/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  setPassword: (data: SetPasswordData) =>
    request<{ success: boolean; message: string }>('/auth/set-password/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  changePassword: (data: ChangePasswordData) =>
    request<{ success: boolean; message: string }>('/auth/change-password/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export default authService;
