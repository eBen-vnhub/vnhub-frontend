import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title: string;
  message: string;
}

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, isDeleting, title, message }: DeleteConfirmationModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden animate-slideUp shadow-2xl">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-error" />
          </div>
          
          <h2 className="text-xl font-bold text-main mb-2">{title}</h2>
          <p className="text-muted leading-relaxed">{message}</p>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 bg-error hover:bg-error/90 text-white py-3 px-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? t.common.loading : t.portal.vendorAdmin.removeUser || 'Remove'}
            </button>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 border-2 border-border hover:bg-surface-hover text-main py-3 px-4 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {t.common.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
