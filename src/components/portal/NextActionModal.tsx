import { X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import Button from '../ui/Button';

interface NextActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export default function NextActionModal({ isOpen, onClose, onContinue }: NextActionModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-surface rounded-3xl shadow-2xl flex flex-col p-6 animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted hover:text-main hover:bg-surface-hover rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mt-4 mb-8 text-center">
          <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowRight className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-main mb-2">{t.portal.nextActionModal?.title || 'Next Step: Benefit Listing'}</h2>
          <p className="text-muted">
            {t.portal.nextActionModal?.description || 'You\'ve successfully completed your Vendor Listing! The next required step is to set up your VN Benefits profile.'}
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            {t.portal.nextActionModal?.later || 'Do it later'}
          </Button>
          <Button className="flex-1" onClick={onContinue}>
            {t.portal.nextActionModal?.continue || 'Start Benefit Listing'}
          </Button>
        </div>
      </div>
    </div>
  );
}
