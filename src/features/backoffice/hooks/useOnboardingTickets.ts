import { useState, useEffect, useCallback } from 'react';
import type { OnboardingTicket } from '../../../types/onboarding';
import onboardingService from '../../../services/onboarding';

export function useOnboardingTickets() {
  const [tickets, setTickets] = useState<OnboardingTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await onboardingService.getTickets();
      setTickets(data);
    } catch {
      setError('Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const updateTicketLocally = useCallback((updated: OnboardingTicket) => {
    setTickets(prev => prev.map(t => (t.id === updated.id ? updated : t)));
  }, []);

  return { tickets, isLoading, error, refetch: fetchTickets, updateTicketLocally };
}
