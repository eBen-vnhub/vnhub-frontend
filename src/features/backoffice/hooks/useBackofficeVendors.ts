import { useState, useCallback } from 'react';
import backofficeService, { BackofficeVendorSummary, BackofficeVendorDetail } from '../../../services/backoffice';
import toast from 'react-hot-toast';
import { useLanguage } from '../../../i18n/LanguageContext';

export function useBackofficeVendors() {
  const [vendors, setVendors] = useState<BackofficeVendorSummary[]>([]);
  const [vendorDetail, setVendorDetail] = useState<BackofficeVendorDetail | null>(null);
  const [listingsData, setListingsData] = useState<{ vendorListing: any; benefitListing: any } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const { t } = useLanguage();

  const fetchVendors = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await backofficeService.getVendors();
      setVendors(data);
    } catch (err: any) {
      toast.error(t.error?.general || 'Failed to fetch vendors');
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const fetchVendorDetail = useCallback(async (vendorId: string | number) => {
    setIsLoadingDetails(true);
    try {
      const [detailData, listings] = await Promise.all([
        backofficeService.getVendorDetail(vendorId),
        backofficeService.getVendorListings(vendorId)
      ]);
      setVendorDetail(detailData);
      setListingsData(listings);
    } catch (err: any) {
      toast.error('Failed to load vendor details');
      setVendorDetail(null);
      setListingsData(null);
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  return {
    vendors,
    vendorDetail,
    listingsData,
    isLoading,
    isLoadingDetails,
    fetchVendors,
    fetchVendorDetail,
  };
}
