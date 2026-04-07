import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import vendorsService from '../services/vendors';
import type { Vendor, Subscription } from '../types';

interface VendorsContextType {
  vendor: Vendor | null;
  subscriptions: Subscription[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateVendorContext: (vendorData: Vendor) => void;
  updateSubscriptionInContext: (updatedSub: Subscription) => void;
  fetchDashboardData: () => Promise<void>;
}

const VendorsContext = createContext<VendorsContextType | null>(null);

export function VendorsProvider({ children }: { children: ReactNode }) {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendorData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await vendorsService.getDashboardData();
      setVendor(data.vendor);
      setSubscriptions(data.subscriptions);
    } catch (err: any) {
      if (err.status !== 404) {
        setError(err.message || 'Failed to load vendor data');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateVendorContext = useCallback((vendorData: Vendor) => {
    setVendor(vendorData);
  }, []);

  const updateSubscriptionInContext = useCallback((updated: Subscription) => {
    setSubscriptions(prev => prev.map(s => s.id === updated.id ? updated : s));
  }, []);

  useEffect(() => {
    fetchVendorData();
  }, [fetchVendorData]);

  return (
    <VendorsContext.Provider
      value={{
        vendor,
        subscriptions,
        isLoading,
        error,
        refresh: fetchVendorData,
        updateVendorContext,
        updateSubscriptionInContext,
        fetchDashboardData: fetchVendorData
      }}
    >
      {children}
    </VendorsContext.Provider>
  );
}

export function useVendors() {
  const context = useContext(VendorsContext);
  if (!context) throw new Error('useVendors must be used within VendorsProvider');
  return context;
}
