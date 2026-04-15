import { useState } from 'react';
import { Building, Globe, MapPin, Tag, Lock, Edit2, Info, X } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useCompanyProfile } from '../hooks/useCompanyProfile';
import { useLanguage } from '../../../i18n/LanguageContext';
import { useVendors } from '../../../contexts/VendorsContext';
import type { Vendor } from '../../../types';

interface CompanyProfileFormProps {
  initialData: Vendor;
  onUpdate: (vendor: Vendor) => void;
  onUpdateVendorListing?: () => void;
  onUpdateBenefitListing?: () => void;
}

export default function CompanyProfileForm({ initialData, onUpdate, onUpdateVendorListing, onUpdateBenefitListing }: CompanyProfileFormProps) {
  const { formData, listingsData, isLoadingListings, isSubmitting, canEditCompanyProfile, handleChange, handleSubmit } = useCompanyProfile(initialData, onUpdate);
  const { t } = useLanguage();
  const { branches } = useVendors();
  const [isEditing, setIsEditing] = useState(false);

  const isViewOnly = !canEditCompanyProfile || !isEditing;

  const handleLovChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    handleChange({
      target: { name: 'businessTypeB2B', value: val, type: 'checkbox', checked: val === 'B2B' || val === 'BOTH' }
    } as any);
    handleChange({
      target: { name: 'businessTypeB2C', value: val, type: 'checkbox', checked: val === 'B2C' || val === 'BOTH' }
    } as any);
  };

  const currentBusinessTypeValue =
    formData.businessTypeB2B && formData.businessTypeB2C ? 'BOTH' :
      formData.businessTypeB2B ? 'B2B' :
        formData.businessTypeB2C ? 'B2C' : '';

  const handleFormSubmit = async (e: React.FormEvent) => {
    await handleSubmit(e);
    if (!isSubmitting) {
      setIsEditing(false);
    }
  };

  const disabledFieldClass = 'bg-surface-hover/50 text-muted-foreground select-none opacity-80';

  return (
    <div className="bg-surface border border-border shadow-sm rounded-3xl p-6 sm:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-main flex items-center gap-2">
            <Building className="w-5 h-5 text-brand" />
            {t.portal.companyProfile.title}
          </h2>
          <p className="text-sm text-muted mt-1">{t.portal.companyProfile.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          {!canEditCompanyProfile ? (
            <div className="inline-flex items-center gap-2 bg-surface-hover/50 border border-border px-3 py-1.5 rounded-full">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{t.portal.companyProfile.viewOnlyMode}</span>
            </div>
          ) : !isEditing ? (
            <Button type="button" variant="outline" onClick={() => setIsEditing(true)} className="flex items-center gap-2 rounded-full">
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="flex items-center gap-2 rounded-full text-muted-foreground hover:text-main">
              <X className="w-4 h-4" />
              Cancel
            </Button>
          )}
        </div>
      </div>

      {!canEditCompanyProfile && (
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
          <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
          <p className="text-sm text-blue-900 leading-relaxed text-left">
            <strong>{t.portal.companyProfile.restrictedAccess}</strong> {t.portal.companyProfile.restrictedMessage}
          </p>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-bold text-main uppercase tracking-wide">Company Identity</h3>
            <span className="text-[10px] font-semibold text-muted bg-surface-hover px-2 py-0.5 rounded-full flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              This Workspace Only
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label={t.portal.companyProfile.headquartersCountry}
              name="companyCountry"
              value={formData.companyCountry}
              onChange={handleChange}
              icon={<MapPin className="w-5 h-5" />}
              disabled
              required
              className={disabledFieldClass}
            />

            <Input
              label={t.portal.companyProfile.companyWebsite}
              name="companyWebsite"
              type="url"
              value={formData.companyWebsite}
              onChange={handleChange}
              icon={<Globe className="w-5 h-5" />}
              disabled={isViewOnly}
              placeholder={t.portal.companyProfile.websitePlaceholder}
              className={isViewOnly ? disabledFieldClass : ''}
            />
          </div>
        </section>

        <hr className="border-border" />

        <section>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-main uppercase tracking-wide">Global Company Data</h3>
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Info className="w-3 h-3" />
              Shared Across All Branches
            </span>
          </div>
          {isEditing && (
            <p className="text-xs text-amber-700 mb-4 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 shrink-0" />
              Changes here will sync to all your workspaces globally.
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label={t.portal.companyProfile.companyName}
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              icon={<Building className="w-5 h-5" />}
              disabled={isViewOnly}
              required
              className={isViewOnly ? disabledFieldClass : ''}
            />

            <Input
              label={t.portal.companyProfile.businessCategory}
              name="businessCategory"
              value={formData.businessCategory}
              onChange={handleChange}
              icon={<Tag className="w-5 h-5" />}
              disabled={isViewOnly}
              required
              className={isViewOnly ? disabledFieldClass : ''}
            />

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isViewOnly ? 'text-muted-foreground' : 'text-main'}`}>
                Business Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 pl-3 md:ps-4 flex items-center pointer-events-none">
                  <Tag className={`w-5 h-5 ${isViewOnly ? 'text-muted-foreground/50' : 'text-muted-foreground'}`} />
                </div>
                <select
                  name="businessType"
                  value={currentBusinessTypeValue}
                  onChange={handleLovChange}
                  disabled={isViewOnly}
                  required
                  className={`w-full rounded-xl border px-10 md:ps-12 py-2.5 text-sm outline-none transition-all duration-200 appearance-none
                    ${isViewOnly ? `${disabledFieldClass} cursor-not-allowed border-border/50` : 'bg-surface border-border text-main focus:border-brand focus:ring-1 focus:ring-brand hover:border-border-hover'}
                  `}
                >
                  <option value="" disabled>Select Business Type...</option>
                  <option value="B2C">B2C (Business to Consumer)</option>
                  <option value="B2B">B2B (Business to Business)</option>
                  <option value="BOTH">Both (B2B & B2C)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {branches.length > 0 && (
          <div className="p-4 rounded-xl border border-border bg-surface-hover/30">
            <p className="text-sm font-semibold text-main mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand" />
              {t.portal.companyProfile.otherBranches || 'Other Branches'}
            </p>
            <div className="flex flex-wrap gap-2">
              {branches.map((country) => (
                <span
                  key={country}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-brand/10 text-brand rounded-full"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {country}
                </span>
              ))}
            </div>
          </div>
        )}

        <hr className="border-border" />

        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-main uppercase tracking-wide">
                {(t.portal.companyProfile as any).vendorListingData || 'Vendor Listing Data'}
              </h3>
              <span className="text-[10px] font-semibold text-muted bg-surface-hover px-2 py-0.5 rounded-full flex items-center gap-1">
                <Building className="w-3 h-3" />
                {(t.portal.companyProfile as any).companyProfileSection || 'Company Profile'}
              </span>
            </div>
            {canEditCompanyProfile && (
              <Button
                type="button"
                variant="outline"
                className="text-sm rounded-full py-1.5 px-4"
                onClick={onUpdateVendorListing}
              >
                {listingsData?.vendorListing
                  ? ((t.portal.companyProfile as any).updateVendorData || 'Update Vendor listing Data')
                  : ((t.portal.companyProfile as any).createVendorData || 'Complete Vendor listing Profile')}
              </Button>
            )}
          </div>
          <p className="text-sm text-muted mb-4">
            {(t.portal.companyProfile as any).vendorListingDesc || 'Manage your company logo, trade license, specific brand information, and social media links.'}
          </p>

          <div className="bg-surface border border-border hover:border-brand/30 transition-colors rounded-xl p-5 shadow-sm">
            {listingsData?.vendorListing ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-main">{listingsData.vendorListing.companyProfile?.brandName || 'N/A'}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{listingsData.vendorListing.companyProfile?.brandDescription || t.backoffice.listing.noDescription}</p>
                    </div>
                  </div>
                </div>

                {listingsData.vendorListing.administrator && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase">{t.backoffice.listing.administrator}</p>
                      <p className="text-sm text-main font-medium">
                        {listingsData.vendorListing.administrator.firstName} {listingsData.vendorListing.administrator.lastName}
                      </p>
                      <p className="text-xs text-muted">{listingsData.vendorListing.administrator.email}</p>
                      <p className="text-xs text-muted">{listingsData.vendorListing.administrator.phoneCountryCode} {listingsData.vendorListing.administrator.phoneNumber}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase">{t.backoffice.listing.companyPhones}</p>
                      {listingsData.vendorListing.companyPhones ? (
                        <div className="space-y-1">
                          <p className="text-sm text-main font-medium">{t.backoffice.listing.landline}: {listingsData.vendorListing.companyPhones.hqLandlineCountryCode} {listingsData.vendorListing.companyPhones.hqLandlineNumber}</p>
                          <p className="text-sm text-main font-medium">{t.backoffice.listing.mobile}: {listingsData.vendorListing.companyPhones.companyMobileCountryCode} {listingsData.vendorListing.companyPhones.companyMobileNumber}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted">{t.backoffice.listing.noPhoneInfo}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase flex items-center gap-1"><MapPin className="w-3 h-3" /> {t.backoffice.listing.hqAddress}</p>
                    <p className="text-sm text-main font-medium">
                      {listingsData.vendorListing.hqAddressEntity ? (
                        `${listingsData.vendorListing.hqAddressEntity.building || ''} ${listingsData.vendorListing.hqAddressEntity.street || ''}, ${listingsData.vendorListing.hqAddressEntity.city || ''}`
                      ) : t.backoffice.listing.noAddress}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase flex items-center gap-1"><Globe className="w-3 h-3" /> {t.backoffice.listing.website}</p>
                    {listingsData.vendorListing.companyProfile?.websiteUrl ? (
                      <a href={listingsData.vendorListing.companyProfile.websiteUrl} target="_blank" rel="noreferrer" className="text-sm text-brand font-medium truncate block hover:underline">
                        {listingsData.vendorListing.companyProfile.websiteUrl}
                      </a>
                    ) : (
                      <p className="text-sm text-muted">{formData.companyWebsite || t.backoffice.listing.noLinks}</p>
                    )}
                  </div>
                </div>

                {(listingsData.vendorListing.companyLocations?.length > 0 || listingsData.vendorListing.deliveryLocations?.length > 0) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {listingsData.vendorListing.companyLocations?.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase">{t.backoffice.listing.companyLocations}</p>
                        <p className="text-sm text-main font-medium">
                          {listingsData.vendorListing.companyLocations.map((loc: any) => (loc.country?.countryName || loc.country?.countryCode)).join(', ')}
                        </p>
                      </div>
                    )}
                    {listingsData.vendorListing.deliveryLocations?.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase">{t.backoffice.listing.deliveryCoverage}</p>
                        <p className="text-sm text-main font-medium">
                          {listingsData.vendorListing.deliveryLocations.map((dl: any) =>
                            dl.isWorldwide ? `🌍 ${t.backoffice.listing.worldwide}` : (dl.country?.countryName || dl.country?.countryCode)
                          ).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {listingsData.vendorListing.socialLinks?.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">{t.backoffice.listing.webSocial}</p>
                    <div className="flex flex-wrap gap-2">
                      {listingsData.vendorListing.socialLinks.map((link: any, idx: number) => (
                        <a key={idx} href={link.url || link.link} target="_blank" rel="noreferrer" className="text-xs bg-surface-hover border border-border px-2 py-1 rounded-lg text-brand hover:underline capitalize">
                          {typeof link.platform === 'object' ? link.platform.platformName : (link.platform || link.type || 'Social')}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {listingsData.vendorListing.files && listingsData.vendorListing.files.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground uppercase mb-2">{t.backoffice.listing.documents}</p>
                    <div className="flex flex-wrap gap-2">
                      {listingsData.vendorListing.files.map((f: any, idx: number) => (
                        <a key={idx} href={f.fileUrl || f.url || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-surface-hover px-3 py-1.5 rounded-lg border border-border text-xs text-main hover:border-brand/30 transition-colors">
                          <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="font-medium truncate max-w-[120px]" title={f.fileName}>{f.fileName}</span>
                          <span className="text-[9px] bg-brand/10 text-brand px-1.5 py-0.5 rounded">
                            {(t.common.documentTypes as any)?.[f.fileType] || f.fileType?.replace(/_/g, ' ')}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ) : isLoadingListings ? (
              <div className="flex items-center gap-3 p-2">
                <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-muted animate-pulse">{t.common.loading}</p>
              </div>
            ) : (
              <div className="flex flex-col flex-center items-center justify-center p-6 text-center">
                <div className="w-12 h-12 bg-surface-hover rounded-full flex items-center justify-center mb-3">
                  <Building className="w-5 h-5 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-main">{(t.portal.companyProfile as any).noVendorData || 'No vendor listing data provided yet.'}</p>
                {canEditCompanyProfile && <p className="text-xs text-muted-foreground mt-1">{(t.portal.companyProfile as any).clickToUpdate || 'Click "Update Vendor listing Data" to complete your profile.'}</p>}
              </div>
            )}
          </div>
        </section>

        <hr className="border-border" />

        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-main uppercase tracking-wide">
                {(t.portal.companyProfile as any).benefitListingData || 'Benefit Listing Data'}
              </h3>
              <span className="text-[10px] font-semibold text-muted bg-surface-hover px-2 py-0.5 rounded-full flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {(t.portal.companyProfile as any).discountOffers || 'Discount Offers'}
              </span>
            </div>
            {canEditCompanyProfile && (
              <Button
                type="button"
                variant="outline"
                className="text-sm rounded-full py-1.5 px-4 flex items-center gap-2"
                onClick={onUpdateBenefitListing}
              >
                <Edit2 className="w-3.5 h-3.5" />
                {listingsData?.benefitListing
                  ? ((t.portal.companyProfile as any).updateBenefitData || 'Update Benefit listing Data')
                  : ((t.portal.companyProfile as any).createBenefitData || 'Create Benefit Listing')}
              </Button>
            )}
          </div>

          <div className="bg-surface border border-border hover:border-brand/30 transition-colors rounded-xl p-5 shadow-sm">
            {listingsData?.benefitListing ? (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-border">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">{(t.portal.companyProfile as any).listingGoal || 'Listing Goal'}</p>
                    <p className="text-sm text-main font-medium">{listingsData.benefitListing.listingGoal?.replace(/_/g, ' ') || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">{(t.portal.companyProfile as any).advertisingFor || 'Advertising For'}</p>
                    <p className="text-sm text-main font-medium">{listingsData.benefitListing.advertisingFor?.replace(/_/g, ' ') || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">{(t.portal.companyProfile as any).preferredLang || 'Preferred Language'}</p>
                    <p className="text-sm text-main font-medium">{listingsData.benefitListing.preferredLanguage === 'ar' ? 'العربية' : 'English'}</p>
                  </div>
                </div>

                {listingsData.benefitListing.benefitOffers && listingsData.benefitListing.benefitOffers.length > 0 ? (
                  <div className="space-y-4">
                    {listingsData.benefitListing.benefitOffers.map((offer: any, idx: number) => (
                      <div key={idx} className="border border-border rounded-xl p-4 space-y-4 bg-surface-hover/20">
                        <div className="flex flex-col gap-2 pb-3 border-b border-border">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs text-muted-foreground uppercase">{(t.portal.companyProfile as any).benefitName || 'Benefit Name'}</p>
                              <h4 className="text-sm font-bold text-main mt-0.5">{offer.benefitName || 'N/A'}</h4>
                            </div>
                            {offer.discountPercentage > 0 && (
                              <div className="text-right">
                                <p className="text-[10px] text-muted-foreground uppercase opacity-0 select-none">.</p>
                                <span className="text-sm font-black text-brand bg-brand/10 px-3 py-1 rounded-lg whitespace-nowrap mt-0.5 block border border-brand/20">
                                  {offer.discountPercentage}% OFF
                                </span>
                              </div>
                            )}
                          </div>
                          {offer.benefitDescription && (
                            <div className="mt-1">
                              <p className="text-xs text-muted-foreground uppercase">{(t.portal.companyProfile as any).benefitDescription || 'Short Description'}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{offer.benefitDescription}</p>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {offer.currency && (
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase">{(t.portal.companyProfile as any).currency || 'Currency'}</p>
                              <p className="text-sm text-main font-medium">{offer.currency}</p>
                            </div>
                          )}
                          {offer.productUnits && (
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase">{(t.portal.companyProfile as any).productUnits || 'Product Units'}</p>
                              <p className="text-sm text-main font-medium">{offer.productUnits}</p>
                            </div>
                          )}
                          {offer.originalPrice != null && (
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase">{(t.portal.companyProfile as any).originalPrice || 'Original Price'}</p>
                              <p className="text-sm text-main font-medium">{offer.originalPrice} {offer.currency}</p>
                            </div>
                          )}
                          {offer.discountedPrice != null && (
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase">{(t.portal.companyProfile as any).discountedPrice || 'Discounted Price'}</p>
                              <p className="text-sm text-main font-medium">{offer.discountedPrice} {offer.currency}</p>
                            </div>
                          )}
                        </div>

                        {offer.valueProposition && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase">{(t.portal.companyProfile as any).valueProposition || 'Value Proposition'}</p>
                            <p className="text-sm text-main font-medium">{offer.valueProposition.replace(/_/g, ' ')}</p>
                          </div>
                        )}

                        {(offer.brandIntro || offer.brandDifferentiator) && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {offer.brandIntro && (
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase">{(t.portal.companyProfile as any).brandIntro || 'Brand Introduction'}</p>
                                <p className="text-sm text-main">{offer.brandIntro}</p>
                              </div>
                            )}
                            {offer.brandDifferentiator && (
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase">{(t.portal.companyProfile as any).brandDifferentiator || 'Brand Differentiator'}</p>
                                <p className="text-sm text-main">{offer.brandDifferentiator}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {offer.detailedContent && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase">{(t.portal.companyProfile as any).detailedContent || 'Detailed Content'}</p>
                            <p className="text-sm text-main">{offer.detailedContent}</p>
                          </div>
                        )}

                        {(offer.featuresContent || offer.limitationsContent) && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {offer.featuresContent && (
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase">{(t.portal.companyProfile as any).features || 'Features'}</p>
                                <p className="text-sm text-main">{offer.featuresContent}</p>
                              </div>
                            )}
                            {offer.limitationsContent && (
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase">{(t.portal.companyProfile as any).limitations || 'Limitations'}</p>
                                <p className="text-sm text-main">{offer.limitationsContent}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {offer.hasFreeGift && offer.freeGiftDescription && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase">{(t.portal.companyProfile as any).freeGift || 'Free Gift'}</p>
                            <p className="text-sm text-main">{offer.freeGiftDescription}</p>
                          </div>
                        )}

                        {offer.referenceUrl && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase">{(t.portal.companyProfile as any).referenceUrl || 'Reference URL'}</p>
                            <a href={offer.referenceUrl} target="_blank" rel="noreferrer" className="text-sm text-brand hover:underline truncate block">{offer.referenceUrl}</a>
                          </div>
                        )}

                        {offer.targeting && (
                          <div className="pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground uppercase mb-2">{(t.portal.companyProfile as any).targeting || 'Targeting'}</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase">{(t.portal.companyProfile as any).geoTargeting || 'Geographic'}</p>
                                <p className="text-sm text-main font-medium">{offer.targeting.geoTargetingType?.replace(/_/g, ' ') || 'N/A'}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase">{(t.portal.companyProfile as any).genderTargeting || 'Gender'}</p>
                                <p className="text-sm text-main font-medium">
                                  {offer.targeting.genderTargeting === 'ALL' ? 'Male & Female' : offer.targeting.genderTargeting || 'Male & Female'}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase">{(t.portal.companyProfile as any).parentTargeting || 'Parent Status'}</p>
                                <p className="text-sm text-main font-medium">
                                  {offer.targeting.parentTargeting === 'ALL' ? 'Parents & Singles' : 
                                   offer.targeting.parentTargeting === 'PARENTS' ? 'Only Parents' : 'Non-Parents'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {offer.claimSettings && (
                          <div className="pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground uppercase mb-2">{(t.portal.companyProfile as any).claimSettings || 'Claim Settings'}</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase">{(t.portal.companyProfile as any).claimMethod || 'Claim Method'}</p>
                                <p className="text-sm text-main font-medium">{offer.claimSettings.claimMethod?.replace(/_/g, ' ') || 'N/A'}</p>
                              </div>
                              {offer.claimSettings.discountCodeType && (
                                <div className="space-y-1">
                                  <p className="text-[10px] text-muted-foreground uppercase">{(t.portal.companyProfile as any).codeType || 'Code Type'}</p>
                                  <p className="text-sm text-main font-medium">{offer.claimSettings.discountCodeType?.replace(/_/g, ' ')}</p>
                                </div>
                              )}
                              {offer.claimSettings.paymentCollection && (
                                <div className="space-y-1">
                                  <p className="text-[10px] text-muted-foreground uppercase">{(t.portal.companyProfile as any).payment || 'Payment'}</p>
                                  <p className="text-sm text-main font-medium">{offer.claimSettings.paymentCollection?.replace(/_/g, ' ')}</p>
                                </div>
                              )}
                              {offer.claimSettings.purchaseMethod && (
                                <div className="space-y-1">
                                  <p className="text-[10px] text-muted-foreground uppercase">{(t.portal.companyProfile as any).purchaseMethod || 'Purchase Method'}</p>
                                  <p className="text-sm text-main font-medium">{offer.claimSettings.purchaseMethod?.replace(/,/g, ', ')}</p>
                                </div>
                              )}
                              {offer.claimSettings.receiveMethod && (
                                <div className="space-y-1">
                                  <p className="text-[10px] text-muted-foreground uppercase">{(t.portal.companyProfile as any).receiveMethod || 'Receive Method'}</p>
                                  <p className="text-sm text-main font-medium">{offer.claimSettings.receiveMethod?.replace(/,/g, ', ')}</p>
                                </div>
                              )}
                              {offer.claimSettings.claimButtonText && (
                                <div className="space-y-1">
                                  <p className="text-[10px] text-muted-foreground uppercase">{(t.portal.companyProfile as any).claimButton || 'CTA Button'}</p>
                                  <p className="text-sm text-main font-medium">{offer.claimSettings.claimButtonText}</p>
                                </div>
                              )}
                            </div>
                            {offer.claimSettings.claimTermsUrl && (
                              <div className="mt-2">
                                <a href={offer.claimSettings.claimTermsUrl} target="_blank" rel="noreferrer" className="text-xs text-brand hover:underline">
                                  {(t.portal.companyProfile as any).viewTerms || 'View Terms & Conditions'}
                                </a>
                              </div>
                            )}
                          </div>
                        )}

                        {offer.mediaAssets && offer.mediaAssets.length > 0 && (
                          <div className="pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground uppercase mb-2">{(t.portal.companyProfile as any).mediaAssets || 'Documents & Media'}</p>
                            <div className="flex flex-wrap gap-4">
                              {offer.mediaAssets.map((asset: any) => (
                                <div key={asset.id} className="flex flex-col gap-1 items-center">
                                  <a href={asset.fileUrl} target="_blank" rel="noreferrer" className="block w-20 h-20 rounded-lg border border-border overflow-hidden hover:border-brand/50 transition-colors bg-surface-hover">
                                    {asset.mediaType === 'IMAGE' ? (
                                      <img src={asset.fileUrl} alt={asset.altText || asset.mediaCategory} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase break-words px-1 text-center">
                                        {asset.mediaType}
                                      </div>
                                    )}
                                  </a>
                                  <span className="text-[10px] text-muted-foreground uppercase max-w-[5rem] text-center truncate" title={asset.mediaCategory?.replace(/_/g, ' ')}>
                                    {asset.mediaCategory?.replace(/_/g, ' ')}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">{(t.portal.companyProfile as any).noBenefitData || 'No Benefit Listing Data'}</p>
                )}

                )}
              </div>
            ) : isLoadingListings ? (
              <div className="flex items-center gap-3 p-2">
                <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-muted animate-pulse">{t.common.loading}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 bg-surface-hover rounded-full flex items-center justify-center mb-3">
                  <Tag className="w-5 h-5 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-main">{(t.portal.companyProfile as any).noBenefitData || 'No Benefit Listing Data'}</p>
              </div>
            )}
          </div>
        </section>

        {isEditing && (
          <div className="flex justify-end pt-4 border-t border-border gap-3 animate-in slide-in-from-bottom-2 duration-300">
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full sm:w-auto rounded-full"
            >
              {t.portal.companyProfile.saveChanges}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
