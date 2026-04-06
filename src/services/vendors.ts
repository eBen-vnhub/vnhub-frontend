import type { Vendor, Subscription } from '../types';

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

const vendorsService = {
  getDashboardData: () =>
    request<{ vendor: Vendor; subscriptions: Subscription[] }>('/vendors/me/'),
};

export default vendorsService;
