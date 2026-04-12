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
          
          {/* Display Real Vendor Data */}
          <div className="bg-surface-hover/30 rounded-xl p-4 border border-border">
            {listingsData?.vendorListing ? (
               <div className="flex flex-col gap-2">
                 {listingsData.vendorListing.companyLocations?.length > 0 && (
                   <p className="text-sm"><strong>Status:</strong> {listingsData.vendorListing.formStatus}</p>
                 )}
                 <p className="text-sm text-muted">Data synchronized from vendor module.</p>
               </div>
            ) : isLoadingListings ? (
               <p className="text-sm text-muted animate-pulse">Loading data...</p>
            ) : (
               <p className="text-sm text-muted">No vendor data provided yet.</p>
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
                className="text-sm rounded-full py-1.5 px-4"
                onClick={onUpdateBenefitListing}
              >
                {(t.portal.companyProfile as any).updateBenefitData || 'Update Benefit Data'}
              </Button>
            )}
          </div>
          <p className="text-sm text-muted mb-4">
            {(t.portal.companyProfile as any).benefitListingDesc || 'Manage your specific discount offers, vouchers, and benefit rules.'}
          </p>
          
          {/* Display Real Benefit Data */}
          <div className="bg-surface-hover/30 rounded-xl p-4 border border-border">
            {listingsData?.benefitListing?.benefitOffers?.length > 0 ? (
               <div className="flex flex-col gap-2">
                 {listingsData?.benefitListing?.benefitOffers?.map((offer: any, idx: number) => (
                    <p key={idx} className="text-sm"><strong>{offer.benefitName || 'Offer'}:</strong> {offer.discountPercentage || 0}% discount</p>
                 ))}
               </div>
            ) : isLoadingListings ? (
               <p className="text-sm text-muted animate-pulse">Loading data...</p>
            ) : (
               <p className="text-sm text-muted">No offers configured yet.</p>
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

