import { X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import Button from '../ui/Button';

interface NextActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  nextStepType?: 'VENDOR_LISTING' | 'BENEFIT_LISTING';
}

export default function NextActionModal({ isOpen, onClose, onContinue, nextStepType = 'VENDOR_LISTING' }: NextActionModalProps) {
  const { t } = useLanguage();
  const isAr = document.documentElement.dir === 'rtl';

  if (!isOpen) return null;

  const content = nextStepType === 'VENDOR_LISTING' ? {
    title: isAr ? 'الخطوة التالية: إكمال بيانات المورد' : 'Next Step: Complete Vendor Listing',
    description: isAr 
      ? 'لقد اشتركت بنجاح! الخطوة التالية هي ضبط إعدادات بياناتك كمورد.'
      : 'You\'ve successfully subscribed! The next step is to set up your Vendor Listing profile.',
    continue: isAr ? 'بدء إكمال البيانات' : 'Start Vendor Listing',
    later: isAr ? 'لاحقاً' : 'Do it later'
  } : {
    title: t.portal.nextActionModal?.title || (isAr ? 'الخطوة التالية: إكمال العروض' : 'Next Step: Benefit Listing'),
    description: t.portal.nextActionModal?.description || (isAr ? 'لقد أكملت بيانات المورد بنجاح! الخطوة التالية هي إضافة العروض والمزايا.' : 'You\'ve successfully completed your Vendor Listing! The next required step is to set up your VN Benefits profile.'),
    continue: t.portal.nextActionModal?.continue || (isAr ? 'بدء إضافة العروض' : 'Start Benefit Listing'),
    later: t.portal.nextActionModal?.later || (isAr ? 'لاحقاً' : 'Do it later')
  };

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
          <h2 className="text-2xl font-bold text-main mb-2">{content.title}</h2>
          <p className="text-muted">
            {content.description}
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            {content.later}
          </Button>
          <Button className="flex-1" onClick={onContinue}>
            {content.continue}
          </Button>
        </div>
      </div>
    </div>
  );
}
