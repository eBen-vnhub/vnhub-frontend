import { request } from './api';
import type { OnboardingTicket, BenefitTracker, ReviewPayload, UploadLinkPayload } from '../types/onboarding';

const onboardingService = {
  getTickets: () =>
    request<OnboardingTicket[]>('/onboarding/tickets/'),

  assignTicket: (ticketId: string, vsmId?: number) =>
    request<OnboardingTicket>(`/onboarding/tickets/${ticketId}/assign/`, {
      method: 'POST',
      body: vsmId ? JSON.stringify({ vsm_id: vsmId }) : undefined,
    }),

  assignTicketOps: (ticketId: string, opsUserId: number) =>
    request<OnboardingTicket>(`/onboarding/tickets/${ticketId}/assign-ops/`, {
      method: 'POST',
      body: JSON.stringify({ ops_user_id: opsUserId }),
    }),

  sendForms: (ticketId: string) =>
    request<OnboardingTicket>(`/onboarding/tickets/${ticketId}/send-forms/`, {
      method: 'POST',
    }),

  reviewListing: (ticketId: string, payload: ReviewPayload) =>
    request<OnboardingTicket>(`/onboarding/tickets/${ticketId}/review/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateChecklist: (ticketId: string, payload: Partial<Pick<OnboardingTicket, 'setup_org' | 'setup_location' | 'setup_account' | 'setup_admin'>>) =>
    request<OnboardingTicket>(`/onboarding/tickets/${ticketId}/checklist/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  opsCompleteSetup: (ticketId: string) =>
    request<OnboardingTicket>(`/onboarding/tickets/${ticketId}/ops-complete/`, {
      method: 'POST',
    }),

  vsmConfirmCompletion: (ticketId: string) =>
    request<OnboardingTicket>(`/onboarding/tickets/${ticketId}/vsm-confirm/`, {
      method: 'POST',
    }),

  getBenefitTrackers: (vendorId?: number) =>
    request<BenefitTracker[]>(
      vendorId ? `/onboarding/benefits/?vendor_id=${vendorId}` : '/onboarding/benefits/'
    ),

  assignBenefitOps: (benefitId: string, opsUserId: string) =>
    request<BenefitTracker>(`/onboarding/benefits/${benefitId}/assign-ops/`, {
      method: 'POST',
      body: JSON.stringify({ ops_user_id: opsUserId }),
    }),

  uploadBenefitTestLink: (benefitId: string, payload: UploadLinkPayload) =>
    request<BenefitTracker>(`/onboarding/benefits/${benefitId}/upload-test-link/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  reviewBenefitTest: (benefitId: string, payload: ReviewPayload) =>
    request<BenefitTracker>(`/onboarding/benefits/${benefitId}/review-test/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  uploadBenefitLiveLink: (benefitId: string, payload: UploadLinkPayload) =>
    request<BenefitTracker>(`/onboarding/benefits/${benefitId}/upload-live-link/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  requestVendorListingUpdate: (vendorId: number, feedback: string) =>
    request<{ success: boolean }>(`/onboarding/vendors/${vendorId}/request-listing-update/`, {
      method: 'POST',
      body: JSON.stringify({ feedback }),
    }),
};

export default onboardingService;
