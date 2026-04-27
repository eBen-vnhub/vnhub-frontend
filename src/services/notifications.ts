import { request } from './api';

export interface Notification {
  id: string | number;
  title: string;
  title_ar: string;
  message: string;
  message_ar: string;
  is_read: boolean;
  type: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const notificationsService = {
  getNotifications: (page = 1) =>
    request<PaginatedResponse<Notification>>(`/notifications/?page=${page}`),
    
  markAsRead: (ids: (string | number)[]) =>
    request<{ success: boolean }>('/notifications/mark-read/', {
      method: 'POST',
      body: JSON.stringify({ ids })
    })
};
