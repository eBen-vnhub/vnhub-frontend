import { useState } from 'react';
import { useLanguage } from '../../../../i18n/LanguageContext';

interface TestLinkResponseModalProps {
  isOpen: boolean;
  testLink: string;
  onClose: () => void;
  onSubmit: (approved: boolean, feedback: string) => void;
  isSubmitting: boolean;
}

export default function TestLinkResponseModal({ isOpen, testLink, onClose, onSubmit, isSubmitting }: TestLinkResponseModalProps) {
  const { t } = useLanguage();
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleApprove = () => {
    onSubmit(true, '');
    setFeedback('');
  };

  const handleReject = () => {
    onSubmit(false, feedback);
    setFeedback('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-main">{t.vendorPortal.onboarding.testLinkModal.title}</h3>
          <p className="text-sm text-muted mt-1">{t.vendorPortal.onboarding.testLinkModal.subtitle}</p>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              {t.vendorPortal.onboarding.testLinkModal.linkLabel}
            </label>
            <a
              href={testLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand font-semibold hover:underline break-all"
            >
              {testLink}
            </a>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              {t.vendorPortal.onboarding.testLinkModal.feedbackLabel}
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              placeholder={t.vendorPortal.onboarding.testLinkModal.feedbackPlaceholder}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
          >
            {t.vendorPortal.onboarding.testLinkModal.cancel}
          </button>
          <button
            onClick={handleReject}
            disabled={isSubmitting || !feedback.trim()}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-50"
          >
            {t.vendorPortal.onboarding.testLinkModal.requestChanges}
          </button>
          <button
            onClick={handleApprove}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-colors disabled:opacity-50"
          >
            {t.vendorPortal.onboarding.testLinkModal.approve}
          </button>
        </div>
      </div>
    </div>
  );
}
