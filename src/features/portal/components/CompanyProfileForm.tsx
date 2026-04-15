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
                {(t.portal.companyProfile as any).updateVendorData || 'Update Vendor Data'}
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
                    {(() => {
                      const logoFile = listingsData.vendorListing.files?.find((f: any) => f.fileType === 'LOGO');
                      return logoFile?.fileUrl ? (
                        <div className="w-10 h-10 rounded-lg bg-surface-hover border border-border flex items-center justify-center p-1 overflow-hidden">
                          <img 
                            src={logoFile.fileUrl} 
                            alt="" 
                            onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                            className="max-w-full max-h-full object-contain" 
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center font-bold text-lg">
                          {listingsData.vendorListing.companyProfile?.brandName?.charAt(0)?.toUpperCase() || <Building className="w-5 h-5" />}
                        </div>
                      );
                    })()}
                    <div>
                      <h4 className="text-sm font-bold text-main">{listingsData.vendorListing.companyProfile?.brandName || 'N/A'}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{listingsData.vendorListing.companyProfile?.brandDescription || t.backoffice.listing.noDescription}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${listingsData.vendorListing.formStatus === 'SUBMITTED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                    {listingsData.vendorListing.formStatus || 'DRAFT'}
                  </span>
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
                        <div className="flex flex-wrap gap-1">
                          {listingsData.vendorListing.companyLocations.map((loc: any) => (
                            <span key={loc.id} className="text-xs bg-brand/10 text-brand px-2 py-0.5 rounded-full">{loc.country?.countryName || loc.country?.countryCode}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {listingsData.vendorListing.deliveryLocations?.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase">{t.backoffice.listing.deliveryCoverage}</p>
                        <div className="flex flex-wrap gap-1">
                          {listingsData.vendorListing.deliveryLocations.map((dl: any) => (
                            <span key={dl.id} className="text-xs bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded-full">
                              {dl.isWorldwide ? `🌍 ${t.backoffice.listing.worldwide}` : (dl.country?.countryName || dl.country?.countryCode)}
                            </span>
                          ))}
                        </div>
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
                <p className="text-sm font-medium text-main">{t.backoffice.listing.noVendorData}</p>
                {canEditCompanyProfile && <p className="text-xs text-muted-foreground mt-1">{(t.portal.companyProfile as any).clickToUpdate || 'Click "Update Vendor Data" to complete your profile.'}</p>}
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
                {(t.portal.companyProfile as any).updateBenefitData || 'Update Benefit Data'}
              </Button>
            )}
          </div>
          <p className="text-sm text-muted mb-4">
            {(t.portal.companyProfile as any).benefitListingDesc || 'Manage your specific discount offers, vouchers, and benefit rules.'}
          </p>

          {/* Display Real Benefit Data */}
          <div className="bg-surface border border-border hover:border-brand/30 transition-colors rounded-xl p-5 shadow-sm">
            {listingsData?.benefitListing ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border border-dashed">
                  <div className="flex items-center gap-2 text-sm text-main">
                    <Lock className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <span><strong>Goal:</strong> {listingsData.benefitListing.listingGoal?.replace('_', ' ').toUpperCase() || 'Not Specified'}</span>
                  </div>
                </div>

                {listingsData.benefitListing.benefitOffers && listingsData.benefitListing.benefitOffers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {listingsData.benefitListing.benefitOffers.map((offer: any, idx: number) => (
                      <div key={idx} className="bg-surface-hover/50 border border-border p-3 rounded-lg flex flex-col justify-between group">
                        <div>
                          <span className="text-xs font-bold text-brand bg-brand/10 px-2 py-0.5 rounded uppercase mb-1.5 inline-block">Offer {idx + 1}</span>
                          <h5 className="text-sm font-bold text-main">{offer.benefitName || 'Standard Discount'}</h5>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{offer.benefitDescription || 'No description available for this offer.'}</p>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">Type: {offer.discountType || 'N/A'}</span>
                          <span className="text-sm font-black text-main bg-white px-2 py-1 rounded shadow-sm border border-border/50">{offer.discountPercentage || 0}% OFF</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No active offers configured.</p>
                )}
              </div>
            ) : isLoadingListings ? (
              <div className="flex items-center gap-3 p-2">
                <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-muted animate-pulse">Loading benefit data...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 bg-surface-hover rounded-full flex items-center justify-center mb-3">
                  <Tag className="w-5 h-5 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-main">No offers configured yet.</p>
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
