import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useVendors } from '../contexts/VendorsContext';
import { useLanguage } from '../i18n/LanguageContext';

interface UseListingSyncProps {
  onSuccess: () => void;
}

export function useListingSync({ onSuccess }: UseListingSyncProps) {
  const { user } = useAuth();
  const { vendor } = useVendors();
  const { language } = useLanguage();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const iframeReadyRef = useRef(false);
  const dataSentRef = useRef(false);

  const sendSyncData = useCallback(() => {
    if (!iframeRef.current?.contentWindow || !vendor || !user || !iframeReadyRef.current) return;
    if (dataSentRef.current) return;

    dataSentRef.current = true;

    iframeRef.current.contentWindow.postMessage({
      type: 'SYNC_LISTING_DATA',
      vnhubVendorId: vendor.id,
      company: {
        companyName: vendor.companyName || '',
        email: user.email || '',
        headquarterCountry: vendor.companyCountry || '',
      },
      personal: {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        mobileCountryCode: user.mobileCountryCode || '',
        mobileNumber: user.mobileNumber || '',
      },
      language: language
    }, '*');
  }, [vendor, user, language]);

  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'SYNC_LANGUAGE',
        language: language
      }, '*');
    }
  }, [language]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'LISTING_SUCCESS') {
        onSuccess();
      } else if (event.data?.type === 'VENDOR_LISTING_READY') {
        iframeReadyRef.current = true;
        setIsLoading(false);
        dataSentRef.current = false;
        sendSyncData();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      setIsLoading(true);
      iframeReadyRef.current = false;
      dataSentRef.current = false;
    };
  }, [onSuccess, sendSyncData]);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  return {
    iframeRef,
    isLoading,
    handleIframeLoad
  };
}
