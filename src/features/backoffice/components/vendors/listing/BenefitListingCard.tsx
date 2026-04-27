import { useState } from 'react';
import { Ticket, Percent, Users, MapPin, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../../../../i18n/LanguageContext';
import ListingCardHeader from './ListingCardHeader';
import BenefitDetailsDrawer from '../../../../portal/components/benefits/BenefitDetailsDrawer';

interface Props {
  benefitListing: any;
}

export default function BenefitListingCard({ benefitListing }: Props) {
  const { t } = useLanguage();
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  return (
    <>
      <div className="bg-gradient-to-br from-surface to-surface-hover/30 border border-border rounded-3xl overflow-hidden shadow-sm">
        <ListingCardHeader
          icon={<Ticket className="w-5 h-5 text-emerald-600" />}
          title={t.backoffice.listing.benefitListingData}
          status={benefitListing ? benefitListing.formStatus || 'SUBMITTED' : null}
          submittedAt={benefitListing?.submittedAt}
          accentClass="bg-emerald-500/10"
        />

        <div className="p-6">
          {!benefitListing ? (
            <div className="text-center py-8 text-muted border border-dashed border-border rounded-2xl bg-surface/50">
              {t.backoffice.listing.noOffersConfigured}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">{t.backoffice.listing.campaignGoal}</h4>
                <div className="bg-surface border border-border px-4 py-3 rounded-xl text-sm font-medium text-main">
                  {benefitListing.listingGoal?.replace(/_/g, ' ') || t.backoffice.listing.noGoal}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-muted uppercase">{t.backoffice.listing.targetGroup}</span>
                  </div>
                  <div className="font-semibold text-main mt-2">
                    {benefitListing.targetAudience || t.backoffice.listing.allUsers}
                  </div>
                </div>
                <div className="bg-surface border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-muted uppercase">{t.backoffice.listing.offers}</span>
                  </div>
                  <div className="font-semibold text-main mt-2">
                    {benefitListing.benefitOffers?.length > 0
                      ? `${benefitListing.benefitOffers.length} ${t.backoffice.listing.activeOffers}` : t.backoffice.listing.noOffers}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">{t.backoffice.listing.activeOffers}</h4>
                {benefitListing.benefitOffers && benefitListing.benefitOffers.length > 0 ? (
                  <div className="space-y-3">
                    {benefitListing.benefitOffers.map((offer: any, idx: number) => (
                      <div key={idx} className="bg-surface border border-border p-4 rounded-xl flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                          <Percent className="w-6 h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white bg-emerald-600 px-2 py-0.5 rounded uppercase">Offer {idx + 1}</span>
                              <span className="font-bold text-main">{offer.offerType || 'Voucher'}</span>
                            </div>
                            <button
                              onClick={() => setSelectedOffer({ ...offer, benefitName: offer.offerDescription || `Offer ${idx + 1}` })}
                              className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              View Details
                            </button>
                          </div>
                          <div className="text-sm font-semibold text-main mt-2 break-words">
                            {offer.offerDescription || t.backoffice.listing.noDescription}
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
                    {t.backoffice.listing.noOffersDetailed}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <BenefitDetailsDrawer
        benefit={selectedOffer}
        isOpen={!!selectedOffer}
        onClose={() => setSelectedOffer(null)}
      />
    </>
  );
}
