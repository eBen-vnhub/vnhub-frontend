import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useVendors } from '../../../contexts/VendorsContext';
import SubscriptionCard from '../../../components/portal/SubscriptionCard';
import NextActionModal from '../../../components/portal/NextActionModal';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

export default function SubscriptionsPage() {
  const { displayName } = useAuth();
  const { vendor, subscriptions, isLoading, error } = useVendors();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" className="text-brand" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="bg-gradient-to-br from-brand/10 to-brand/5 rounded-3xl p-8 border border-brand/10">
        <h2 className="text-lg font-semibold text-muted mb-2">
          Hi, <span className="text-main">{displayName}</span>
        </h2>
        <h1 className="text-3xl font-bold text-main leading-tight">
          Welcome to <span className="text-brand">VN Hub</span>!
        </h1>
        <p className="text-muted mt-3 max-w-2xl">
          Manage your subscriptions, complete required forms, and track your progress all in one place.
        </p>
      </section>

      {vendor && (
        <section className="bg-surface border border-border shadow-sm rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-main">Company Snapshot</h2>
              <div className="w-12 h-1 bg-brand rounded-full mt-2" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm font-semibold text-muted mb-1">Company Name</p>
              <p className="text-main font-medium">{vendor.companyName}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted mb-1">Country</p>
              <p className="text-main font-medium">{vendor.companyCountry || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted mb-1">Business Category</p>
              <p className="text-main font-medium">{vendor.businessCategory || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted mb-1">Website</p>
              <p className="text-brand font-medium break-words">
                {vendor.companyWebsite ? (
                  <a href={vendor.companyWebsite.startsWith('http') ? vendor.companyWebsite : `https://${vendor.companyWebsite}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {vendor.companyWebsite}
                  </a>
                ) : '—'}
              </p>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-main">My Subscriptions</h2>
            <div className="w-12 h-1 bg-brand rounded-full mt-2" />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl mb-6">
            {error}
          </div>
        )}

        {!vendor || subscriptions.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-3xl border-2 border-dashed border-border">
            <div className="w-16 h-16 mx-auto mb-4 bg-surface-hover rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-main mb-2">No Subscriptions Found</h3>
            <p className="text-muted max-w-md mx-auto">
              You haven't subscribed to any products yet, or your portal is still being created. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {subscriptions.map((sub) => (
              <SubscriptionCard
                key={sub.id}
                subscription={sub}
                companyName={vendor.companyName}
                onNextAction={() => setIsModalOpen(true)}
              />
            ))}
          </div>
        )}
      </section>

      <NextActionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
