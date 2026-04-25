import { useState } from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { useVendorOnboarding } from '../hooks/useVendorOnboarding';
import OnboardingTicketCard from '../components/onboarding/OnboardingTicketCard';
import TestLinkResponseModal from '../components/onboarding/TestLinkResponseModal';
import vendorOnboardingService from '../services/vendorOnboarding';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import type { OnboardingTicket } from '../../../types/onboarding';
import toast from 'react-hot-toast';
import { ClipboardList } from 'lucide-react';

export default function VendorOnboardingPage() {
  const { t } = useLanguage();
  const { tickets, isLoading, error, refetch } = useVendorOnboarding();
  const [selectedTicket, setSelectedTicket] = useState<OnboardingTicket | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRespondTestLink = (ticket: OnboardingTicket) => {
    setSelectedTicket(ticket);
  };

  const handleSubmitResponse = async (approved: boolean, feedback: string) => {
    if (!selectedTicket) return;
    setIsSubmitting(true);
    try {
      await vendorOnboardingService.respondToTestLink(selectedTicket.id, { approved, feedback });
      toast.success(
        approved
          ? t.vendorPortal.onboarding.toasts.approved
          : t.vendorPortal.onboarding.toasts.changesRequested
      );
      setSelectedTicket(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || t.vendorPortal.onboarding.toasts.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" className="text-brand" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <h1 className="text-2xl font-bold text-main">{t.vendorPortal.onboarding.pageTitle}</h1>
        <p className="text-muted mt-1">{t.vendorPortal.onboarding.pageSubtitle}</p>
        <div className="w-12 h-1 bg-brand rounded-full mt-3" />
      </section>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {tickets.length === 0 && !error ? (
        <div className="text-center py-16 bg-surface rounded-3xl border-2 border-dashed border-border">
          <div className="w-16 h-16 mx-auto mb-4 bg-surface-hover rounded-full flex items-center justify-center">
            <ClipboardList className="w-8 h-8 text-muted" />
          </div>
          <h3 className="text-xl font-bold text-main mb-2">{t.vendorPortal.onboarding.emptyTitle}</h3>
          <p className="text-muted max-w-md mx-auto">{t.vendorPortal.onboarding.emptyDescription}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tickets.map(ticket => (
            <OnboardingTicketCard
              key={ticket.id}
              ticket={ticket}
              onRespondTestLink={handleRespondTestLink}
            />
          ))}
        </div>
      )}

      {selectedTicket && (
        <TestLinkResponseModal
          isOpen={!!selectedTicket}
          testLink={selectedTicket.test_link || ''}
          onClose={() => setSelectedTicket(null)}
          onSubmit={handleSubmitResponse}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
