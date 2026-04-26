import { request } from './api';

export interface ActivityLog {
  id: string | number;
  user_name: string;
  user_email: string;
  action: string;
  entity: string;
  details: string;
  timestamp: string;
}

export const settingsService = {
  getLogs: async (date?: string): Promise<ActivityLog[]> => {
    const url = date ? `/core/logs/?date=${date}` : '/core/logs/';
    return await request<ActivityLog[]>(url);
  },
};
