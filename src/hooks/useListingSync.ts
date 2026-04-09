import { useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
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
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      setIsLoading(true);
    };
  }, [onSuccess]);

  const handleIframeLoad = () => {
    setIsLoading(false);

    if (iframeRef.current && iframeRef.current.contentWindow && vendor && user) {
      const payload = {
        type: 'SYNC_LISTING_DATA',
        vnhubVendorId: vendor.id,
        company: {
          companyName: vendor.companyName || '',
          email: user.email || '',
        },
        personal: {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          mobileCountryCode: user.mobileCountryCode || '',
          mobileNumber: user.mobileNumber || '',
        },
        language: language
      };

      iframeRef.current.contentWindow.postMessage(payload, '*');
    }
  };

  return {
    iframeRef,
    isLoading,
    handleIframeLoad
  };
}
