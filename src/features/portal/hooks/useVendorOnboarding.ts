import { useState, useEffect, useCallback } from 'react';
import vendorOnboardingService from '../services/vendorOnboarding';
import type { OnboardingTicket } from '../../../types/onboarding';

export function useVendorOnboarding() {
  const [tickets, setTickets] = useState<OnboardingTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await vendorOnboardingService.getMyTickets();
      setTickets(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to load onboarding tickets');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return { tickets, isLoading, error, refetch: fetchTickets };
}
