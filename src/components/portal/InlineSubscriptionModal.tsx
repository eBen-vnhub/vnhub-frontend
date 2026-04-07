import { useEffect, useRef, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useVendors } from '../../contexts/VendorsContext';
import { useLanguage } from '../../i18n/LanguageContext';

interface InlineSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function InlineSubscriptionModal({ isOpen, onClose, onSuccess }: InlineSubscriptionModalProps) {
  const { user } = useAuth();
  const { vendor } = useVendors();
  const { language } = useLanguage();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const formUrl = import.meta.env.VITE_REGISTRATION_FORM_URL;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SUBSCRIPTION_SUCCESS') {
        onSuccess();
      }
    };

    if (isOpen) {
      window.addEventListener('message', handleMessage);
    }
    
    return () => {
      window.removeEventListener('message', handleMessage);
      setIsLoading(true);
    };
  }, [isOpen, onSuccess, formUrl]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    
    if (iframeRef.current && iframeRef.current.contentWindow && vendor && user) {
      const payload = {
        type: 'SYNC_PORTAL_DATA',
        company: {
          companyName: vendor.companyName || '',
          companyWebsite: vendor.companyWebsite || '',
          country: vendor.companyCountry || '',
          businessTypeB2C: false,
          businessTypeB2B: false,
          businessCategory: vendor.businessCategory || '',
        },
        personal: {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          mobileCountryCode: '',
          mobileNumber: '',
          jobTitle: '',
        },
        language: language
      };
      
      iframeRef.current.contentWindow.postMessage(payload, '*');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-5xl h-full max-h-[90vh] bg-surface rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="absolute top-4 right-4 z-10 bg-surface/80 backdrop-blur-md rounded-full shadow-sm">
          <button
            onClick={onClose}
            className="p-2.5 text-muted hover:text-main hover:bg-surface-hover rounded-full transition-colors flex items-center justify-center bg-surface border border-border"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface z-0">
            <Loader2 className="w-10 h-10 text-brand animate-spin mb-4" />
            <p className="text-muted font-medium animate-pulse">Loading secure form...</p>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={`${formUrl}?embed=true`}
          className="w-full flex-1 border-none bg-transparent relative z-0"
          onLoad={handleIframeLoad}
          title="Subscribe to new product"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
}
