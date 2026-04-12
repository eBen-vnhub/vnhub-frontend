import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useVendors } from '../contexts/VendorsContext';
import { useLanguage } from '../i18n/LanguageContext';

interface UseBenefitListingSyncProps {
  onSuccess: () => void;
}

export function useBenefitListingSync({ onSuccess }: UseBenefitListingSyncProps) {
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
      type: 'SYNC_BENEFIT_DATA',
      vnhubVendorId: vendor.id,
      personal: {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        companyName: vendor.companyName || '',
        phoneNumber: user.mobileNumber || '',
      },
      language,
    }, '*');
  }, [vendor, user, language]);

  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'SYNC_LANGUAGE',
        language,
      }, '*');
    }
  }, [language]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'BENEFIT_LISTING_SUCCESS') {
        onSuccess();
      } else if (event.data?.type === 'BENEFIT_LISTING_READY') {
        iframeReadyRef.current = true;
        setIsLoading(false);
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
    handleIframeLoad,
  };
}
