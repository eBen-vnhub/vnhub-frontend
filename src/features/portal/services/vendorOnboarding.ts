import { request } from '../../../services/api';
import type { OnboardingTicket, ReviewPayload } from '../../../types/onboarding';

const vendorOnboardingService = {
  getMyTickets: () =>
    request<OnboardingTicket[]>('/onboarding/tickets/'),

  respondToTestLink: (ticketId: string, payload: ReviewPayload) =>
    request<OnboardingTicket>(`/onboarding/tickets/${ticketId}/vendor-response/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

export default vendorOnboardingService;
