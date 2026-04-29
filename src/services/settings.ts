import { request } from './api';

export interface ActivityLog {
  id: string | number;
  user_name: string;
  user_email: string;
  user_role: string;
  vendor_name?: string;
  vendor_country?: string;
  action: string;
  entity: string;
  details: any;
  timestamp: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface LogFilters {
  date?: string;
  page?: number;
  search?: string;
  country?: string;
}

export const settingsService = {
  getLogs: async (filters: LogFilters = {}): Promise<{ results: ActivityLog[]; count: number }> => {
    const params = new URLSearchParams();
    params.set('page', String(filters.page || 1));
    if (filters.date) params.set('timestamp__date', filters.date);
    if (filters.search) params.set('search', filters.search);
    if (filters.country) params.set('vendor_country', filters.country);
    const data = await request<PaginatedResponse<ActivityLog>>(`/activity/logs/?${params.toString()}`);
    return { results: data.results || [], count: data.count || 0 };
  },
};
