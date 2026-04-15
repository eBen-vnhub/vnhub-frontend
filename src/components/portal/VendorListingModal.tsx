import { X, Loader2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useListingSync } from '../../hooks/useListingSync';
import { useVendors } from '../../contexts/VendorsContext';

interface VendorListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function VendorListingModal({ isOpen, onClose, onSuccess }: VendorListingModalProps) {
  const { t } = useLanguage();
  const { vendor } = useVendors();

  const handleSuccess = () => {
    onClose();
    if (onSuccess) onSuccess();
  };

  const { iframeRef, isLoading, handleIframeLoad } = useListingSync({
    onSuccess: handleSuccess
  });

  const rawFormUrl = import.meta.env.VITE_VENDOR_LISTING_URL || '';
  const formUrl = rawFormUrl.endsWith('/') ? rawFormUrl : `${rawFormUrl}/`;
  const vendorId = vendor?.id;
  const iframeSrc = formUrl ? `${formUrl}?embed=true${vendorId ? `&vnhubVendorId=${vendorId}` : ''}` : '';

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
            title={t.portal.companyProfile.updateVendorData || 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface z-0">
            <Loader2 className="w-10 h-10 text-brand animate-spin mb-4" />
            <p className="text-muted font-medium animate-pulse">Loading vendor listing form...</p>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={iframeSrc}
          className="w-full flex-1 border-none bg-transparent relative z-0"
          onLoad={handleIframeLoad}
          title="Vendor Listing Form"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
}
