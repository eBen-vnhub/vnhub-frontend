import { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../../../i18n/LanguageContext';
import Button from '../../../../components/ui/Button';

interface RequestListingUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => Promise<void>;
  companyName: string;
}

export default function RequestListingUpdateModal({ isOpen, onClose, onSubmit, companyName }: RequestListingUpdateModalProps) {
  const { t, direction } = useLanguage();
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(feedback);
      setFeedback('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAr = direction === 'rtl';
  const tm = t.backoffice.requestUpdateModal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-main">
              {tm.title}
            </h2>
            <p className="text-sm text-muted mt-1">
              {companyName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted hover:text-main hover:bg-surface-hover rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-brand/10 border border-brand/20 rounded-xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-brand shrink-0 mt-0.5" />
            <p className="text-sm text-main">
              {tm.warning}
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-main">
              {tm.notesLabel}
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full min-h-[120px] p-3 rounded-xl border border-border bg-surface text-main placeholder-muted focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all resize-y"
              placeholder={tm.notesPlaceholder}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t.common.cancel}
            </Button>
            <Button
              type="submit"
              disabled={!feedback.trim() || isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
              )}
              {tm.sendRequest}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
