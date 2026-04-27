import { request } from './api';

export interface Notification {
  id: string | number;
  message_en: string;
  message_ar: string;
  is_read: boolean;
  type: string;
  created_at: string;
}

export const notificationsService = {
  getNotifications: () =>
    request<Notification[]>('/notifications/'),
    
  markAsRead: (ids: (string | number)[]) =>
    request<{ success: boolean }>('/notifications/mark-read/', {
      method: 'POST',
      body: JSON.stringify({ ids })
    })
};
