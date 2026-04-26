import { useLanguage } from '../../../i18n/LanguageContext';
import { useVendorOnboarding } from '../hooks/useVendorOnboarding';
import OnboardingTicketCard from '../components/onboarding/OnboardingTicketCard';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { ClipboardList } from 'lucide-react';

export default function VendorOnboardingPage() {
  const { t } = useLanguage();
  const { tickets, isLoading, error } = useVendorOnboarding();

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
            />
          ))}
        </div>
      )}
    </div>
  );
}
