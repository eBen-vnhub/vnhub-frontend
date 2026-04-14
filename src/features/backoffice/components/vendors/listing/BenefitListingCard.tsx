import { Ticket, Percent, Users, MapPin } from 'lucide-react';
import ListingCardHeader from './ListingCardHeader';

interface Props {
  benefitListing: any;
}

export default function BenefitListingCard({ benefitListing }: Props) {
  return (
    <div className="bg-gradient-to-br from-surface to-surface-hover/30 border border-border rounded-3xl overflow-hidden shadow-sm">
      <ListingCardHeader
        icon={<Ticket className="w-5 h-5 text-emerald-600" />}
        title="Benefit Listing Data"
        status={benefitListing ? benefitListing.formStatus || 'SUBMITTED' : null}
        submittedAt={benefitListing?.submittedAt}
        accentClass="bg-emerald-500/10"
      />

      <div className="p-6">
        {!benefitListing ? (
          <div className="text-center py-8 text-muted border border-dashed border-border rounded-2xl bg-surface/50">
            No offers configured yet.
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Campaign Goal</h4>
              <div className="bg-surface border border-border px-4 py-3 rounded-xl text-sm font-medium text-main">
                {benefitListing.listingGoal?.replace(/_/g, ' ') || 'No specific goal mentioned'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-muted uppercase">Target Group</span>
                </div>
                <div className="font-semibold text-main mt-2">
                  {benefitListing.targetAudience || 'All Users'}
                </div>
              </div>
              <div className="bg-surface border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-muted uppercase">Offers</span>
                </div>
                <div className="font-semibold text-main mt-2">
                  {benefitListing.benefitOffers?.length > 0
                    ? `${benefitListing.benefitOffers.length} Active Offers` : 'No Offers Configured'}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">Active Offers</h4>
              {benefitListing.benefitOffers && benefitListing.benefitOffers.length > 0 ? (
                <div className="space-y-3">
                  {benefitListing.benefitOffers.map((offer: any, idx: number) => (
                    <div key={idx} className="bg-surface border border-border p-4 rounded-xl flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                        <Percent className="w-6 h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-white bg-emerald-600 px-2 py-0.5 rounded uppercase">Offer {idx + 1}</span>
                          <span className="font-bold text-main">{offer.offerType || 'Voucher'}</span>
                        </div>
                        <div className="text-sm font-semibold text-main mt-2 break-words">
                          {offer.offerDescription || 'No description provided'}
                        </div>
                        <div className="text-xs text-muted mt-2 space-y-1">
                          {offer.discountValue && <div><span className="font-medium text-main">Value:</span> {offer.discountValue}</div>}
                          {offer.termsAndConditions && <div className="line-clamp-2"><span className="font-medium text-main">T&C:</span> {offer.termsAndConditions}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-surface-hover/50 border border-border rounded-xl p-4 text-center text-sm text-muted">
                  No specific offers detailed
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
