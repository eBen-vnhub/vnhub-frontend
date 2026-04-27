import { request } from './api';
import type {
  LoginCredentials,
  SetPasswordData,
  ResetPasswordData,
  ForgotPasswordData,
  ChangePasswordData,
  User,
  ApiSuccessResponse,
} from '../types';

const authService = {
  login: (credentials: LoginCredentials) =>
    request<{ user: User }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  logout: () =>
    request<ApiSuccessResponse>('/auth/logout/', {
      method: 'POST',
    }),

  me: () =>
    request<{ user: User }>('/auth/me/'),

  forgotPassword: (email: string) =>
    request<ApiSuccessResponse>('/auth/forgot-password/', {
      method: 'POST',
      body: JSON.stringify({ email } as ForgotPasswordData),
    }),

  resetPassword: (data: ResetPasswordData) =>
    request<ApiSuccessResponse>('/auth/reset-password/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  setPassword: (data: SetPasswordData) =>
    request<ApiSuccessResponse>('/auth/set-password/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  changePassword: (data: ChangePasswordData) =>
    request<ApiSuccessResponse>('/auth/change-password/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getUsers: (page: number = 1, search: string = '') =>
    request<any>(`/auth/users/?page=${page}&search=${search}`),

  createUser: (data: Partial<User>) =>
    request<User>('/auth/users/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateUser: (id: string | number, data: Partial<User>) =>
    request<User>(`/auth/users/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export default authService;
