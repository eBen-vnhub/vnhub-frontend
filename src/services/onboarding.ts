import { request } from './api';
import type { OnboardingTicket, ReviewPayload, UploadLinkPayload } from '../types/onboarding';

const onboardingService = {
  getTickets: () =>
    request<OnboardingTicket[]>('/onboarding/tickets/'),

  assignTicket: (ticketId: string, vsmId?: number) =>
    request<OnboardingTicket>(`/onboarding/tickets/${ticketId}/assign/`, {
      method: 'POST',
      body: vsmId ? JSON.stringify({ vsm_id: vsmId }) : undefined,
    }),

  sendForms: (ticketId: string) =>
    request<OnboardingTicket>(`/onboarding/tickets/${ticketId}/send-forms/`, {
      method: 'POST',
    }),

  reviewForms: (ticketId: string, payload: ReviewPayload) =>
    request<OnboardingTicket>(`/onboarding/tickets/${ticketId}/review/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  uploadTestLink: (ticketId: string, payload: UploadLinkPayload) =>
    request<OnboardingTicket>(`/onboarding/tickets/${ticketId}/ops-upload-test-link/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  uploadLiveLink: (ticketId: string, payload: UploadLinkPayload) =>
    request<OnboardingTicket>(`/onboarding/tickets/${ticketId}/ops-upload-live-link/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  vendorRespondTestLink: (ticketId: string, payload: ReviewPayload) =>
    request<OnboardingTicket>(`/onboarding/tickets/${ticketId}/vendor-respond/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  goLive: (ticketId: string) =>
    request<OnboardingTicket>(`/onboarding/tickets/${ticketId}/go-live/`, {
      method: 'POST',
    }),
};

export default onboardingService;
