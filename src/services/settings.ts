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

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const settingsService = {
  getLogs: async (date?: string, page: number = 1): Promise<{ results: ActivityLog[]; count: number }> => {
    let url = `/core/logs/?page=${page}`;
    if (date) url += `&date=${date}`;
    const data = await request<PaginatedResponse<ActivityLog>>(url);
    return { results: data.results || [], count: data.count || 0 };
  },
};
