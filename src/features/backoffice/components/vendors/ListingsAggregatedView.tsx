import { Image, FileText, Share2, Ticket, Percent, Users, Building, ShieldAlert, MapPin } from 'lucide-react';

interface Props {
  data: { vendorListing: any; benefitListing: any } | null;
}

export default function ListingsAggregatedView({ data }: Props) {
  if (!data) {
    return (
      <div className="bg-surface rounded-2xl p-8 text-center border border-border border-dashed">
        <ShieldAlert className="w-8 h-8 text-muted mx-auto mb-3 opacity-50" />
        <p className="text-muted">No listing data fetched yet.</p>
      </div>
    );
  }

  const { vendorListing, benefitListing } = data;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div className="bg-gradient-to-br from-surface to-surface-hover/30 border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="bg-brand/5 border-b border-border/50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-brand" />
            <h3 className="font-bold text-main">Vendor Listing Data</h3>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${vendorListing ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500'
            }`}>
            {vendorListing ? vendorListing.formStatus || 'SUBMITTED' : 'NOT SUBMITTED'}
          </span>
        </div>

        <div className="p-6">
          {!vendorListing ? (
            <div className="text-center py-8 text-muted border border-dashed border-border rounded-2xl bg-surface/50">
              No vendor data provided yet.
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-3">Brand Identity</h4>
                <div className="bg-surface rounded-2xl border border-border p-4">
                  {vendorListing.brandLogo ? (
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-surface-hover border border-border flex items-center justify-center p-2">
                        <img src={vendorListing.brandLogo} alt="Logo" className="max-w-full max-h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <div className="font-bold text-main text-lg">{vendorListing.brandName}</div>
                        <div className="text-sm text-muted mt-1">{vendorListing.brandDescription}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center font-bold text-xl">
                        {vendorListing.brandName?.charAt(0) || <Image className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-bold text-main">{vendorListing.brandName || 'N/A'}</div>
                        <div className="text-xs text-muted">{vendorListing.brandDescription || 'No description provided'}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-3">Documents</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-surface border border-border rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-muted font-medium mb-0.5">Trade License</div>
                      {vendorListing.tradeLicenseDocument ? (
                        <a href={vendorListing.tradeLicenseDocument} target="_blank" rel="noreferrer" className="text-sm font-semibold text-main hover:text-brand hover:underline truncate block">View Document</a>
                      ) : (
                        <div className="text-sm font-semibold text-main opacity-50">Not uploaded</div>
                      )}
                    </div>
                  </div>

                  <div className="bg-surface border border-border rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-muted font-medium mb-0.5">Tax Certificate</div>
                      {vendorListing.taxCertificateDocument ? (
                        <a href={vendorListing.taxCertificateDocument} target="_blank" rel="noreferrer" className="text-sm font-semibold text-main hover:text-brand hover:underline truncate block">View Document</a>
                      ) : (
                        <div className="text-sm font-semibold text-main opacity-50">Not uploaded</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Share2 className="w-3.5 h-3.5" /> Social Presence
                </h4>
                <div className="bg-surface rounded-xl border border-border divide-y divide-border/50">
                  {['instagram', 'facebook', 'linkedin', 'tiktok', 'twitter', 'youtube'].map(platform => {
                    const url = vendorListing[`${platform}Url`];
                    if (!url) return null;
                    return (
                      <div key={platform} className="px-4 py-3 flex items-center justify-between">
                        <span className="text-sm font-medium text-main capitalize">{platform}</span>
                        <a href={url} target="_blank" rel="noreferrer" className="text-sm text-brand hover:underline truncate max-w-[200px]">
                          {url.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      </div>
                    );
                  })}
                  {!['instagram', 'facebook', 'linkedin', 'tiktok', 'twitter', 'youtube'].some(p => vendorListing[`${p}Url`]) && (
                    <div className="px-4 py-3 text-sm text-muted text-center">No social links provided</div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-surface to-surface-hover/30 border border-border rounded-3xl overflow-hidden shadow-sm flex flex-col">
        <div className="bg-emerald-500/10 border-b border-border/50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-main">Benefit Listing Data</h3>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${benefitListing ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500'
            }`}>
            {benefitListing ? benefitListing.formStatus || 'SUBMITTED' : 'NOT SUBMITTED'}
          </span>
        </div>

        <div className="p-6 flex-1">
          {!benefitListing ? (
            <div className="text-center py-8 text-muted border border-dashed border-border rounded-2xl bg-surface/50 h-full flex items-center justify-center">
              No offers configured yet.
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Campaign Goal</h4>
                <div className="bg-surface border border-border px-4 py-3 rounded-xl text-sm font-medium text-main">
                  {benefitListing.goalDescription || 'No specific goal mentioned'}
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
                    <span className="text-xs font-bold text-muted uppercase">Availability</span>
                  </div>
                  <div className="font-semibold text-main mt-2">
                    {benefitListing.targetedLocations?.length ? benefitListing.targetedLocations.join(', ') : 'All Branches'}
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
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-white bg-emerald-600 px-2 py-0.5 rounded uppercase">Offer {idx + 1}</span>
                            <span className="font-bold text-main">{offer.offerType || 'Voucher'}</span>
                          </div>
                          <div className="text-sm font-semibold text-main mt-2 break-words">
                            {offer.offerDescription || 'No description provided'}
                          </div>
                          <div className="text-xs text-muted mt-2 space-y-1">
                            {offer.discountValue && <div><span className="font-medium text-main">Value:</span> {offer.discountValue}</div>}
                            {offer.termsAndConditions && <div className="truncate"><span className="font-medium text-main">T&C:</span> {offer.termsAndConditions}</div>}
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
    </div>
  );
}
