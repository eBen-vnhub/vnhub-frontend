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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />

      <div className="relative w-full max-w-4xl h-[90vh] bg-surface rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-bold text-main">{t.portal.companyProfile.updateVendorData}</h3>
          <button onClick={onClose} className="p-2 text-muted hover:text-main hover:bg-surface-hover rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative flex-1">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface z-10">
              <Loader2 className="w-8 h-8 text-brand animate-spin" />
            </div>
          )}
          {formUrl ? (
            <iframe
              ref={iframeRef}
              src={iframeSrc}
              className="w-full h-full border-0"
              title="Vendor Listing Form"
              onLoad={handleIframeLoad}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted">Form URL not configured</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
