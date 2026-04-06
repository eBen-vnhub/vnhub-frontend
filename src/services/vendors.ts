import { request } from './api';
import type {
  Vendor,
  Subscription,
  User,
  InviteTeamMemberData,
  ApiSuccessResponse,
} from '../types';

const vendorsService = {
  getDashboardData: () =>
    request<{ vendor: Vendor; subscriptions: Subscription[] }>('/vendors/me/'),

  updateDashboardData: (data: Partial<Vendor>) =>
    request<ApiSuccessResponse & { vendor: Vendor }>('/vendors/me/', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getTeamMembers: () =>
    request<User[]>('/vendors/team/'),

  inviteTeamMember: (data: InviteTeamMemberData) =>
    request<ApiSuccessResponse>('/vendors/team/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  removeTeamMember: (userId: string) =>
    request<ApiSuccessResponse>(`/vendors/team/${userId}/`, {
      method: 'DELETE',
    }),
};

export default vendorsService;
