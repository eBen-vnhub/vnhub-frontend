import { useState, useEffect, useCallback } from 'react';
import onboardingService from '../../../services/onboarding';
import type { BenefitTracker } from '../../../types/onboarding';

export function useBenefitTrackers() {
  const [benefits, setBenefits] = useState<BenefitTracker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await onboardingService.getBenefitTrackers();
      setBenefits(data);
      setError(null);
    } catch {
      setError('Failed to load benefits');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const updateLocally = (updated: BenefitTracker) => {
    setBenefits(prev => prev.map(b => b.id === updated.id ? updated : b));
  };

  return { benefits, isLoading, error, updateLocally, refetch: fetch };
}
