import { request } from './api';
import type {
  Vendor,
  Subscription,
  User,
  InviteTeamMemberData,
  SubscriptionUpdateData,
  ApiSuccessResponse,
} from '../types';

const vendorsService = {
  getDashboardData: () =>
    request<{ vendor: Vendor; subscriptions: Subscription[]; branches: string[] }>('/vendors/company/'),

  getListingsData: () =>
    request<{ vendorListing: any; benefitListing: any }>('/vendors/company/listings-data/'),

  updateDashboardData: (data: Partial<Vendor>) =>
    request<ApiSuccessResponse & { vendor: Vendor }>('/vendors/company/', {
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

  getUserProfile: () =>
    request<User>('/vendors/profile/'),

  updateUserProfile: (data: Partial<User>) =>
    request<ApiSuccessResponse & { user: User }>('/vendors/profile/', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateSubscription: (subscriptionId: number, data: SubscriptionUpdateData) =>
    request<ApiSuccessResponse & { subscription: Subscription }>(`/vendors/subscriptions/${subscriptionId}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  cancelSubscription: (subscriptionId: number) =>
    request<ApiSuccessResponse & { subscription: Subscription }>(`/vendors/subscriptions/${subscriptionId}/`, {
      method: 'DELETE',
    }),

  switchWorkspace: (workspaceId: number) =>
    request<ApiSuccessResponse>('/vendors/workspace/switch/', {
      method: 'POST',
      body: JSON.stringify({ workspace_id: workspaceId }),
    }),

  completeSubscriptionStep: (subscriptionId: number, payload: any) =>
    request<ApiSuccessResponse & { subscription: Subscription }>(`/vendors/subscriptions/${subscriptionId}/complete-step/`, {
      method: 'POST',
      body: JSON.stringify(typeof payload === 'string' ? { stepType: payload } : payload),
    }),
};

export default vendorsService;
