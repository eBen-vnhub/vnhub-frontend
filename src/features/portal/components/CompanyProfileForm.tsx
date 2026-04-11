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
}

export default function CompanyProfileForm({ initialData, onUpdate }: CompanyProfileFormProps) {
  const { formData, isSubmitting, canEditCompanyProfile, handleChange, handleSubmit } = useCompanyProfile(initialData, onUpdate);
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

  return (
    <div className="bg-white/95 backdrop-blur-xl dark:bg-gray-900/95 border border-border shadow-sm rounded-3xl p-6 sm:p-8 animate-in fade-in duration-500">
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

      {isEditing && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3 animate-in fade-in duration-300">
          <Info className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-900 leading-relaxed text-start">
            <strong>Global Shared Data:</strong> Any modifications made to these fields will be automatically synchronized and reflect across all your branches and configured workspaces globally.
          </p>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={t.portal.companyProfile.companyName}
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            icon={<Building className="w-5 h-5" />}
            disabled={isViewOnly}
            required
            className={isViewOnly ? 'bg-surface-hover/50 text-muted-foreground select-none opacity-80' : ''}
          />

          <Input
            label={t.portal.companyProfile.headquartersCountry}
            name="companyCountry"
            value={formData.companyCountry}
            onChange={handleChange}
            icon={<MapPin className="w-5 h-5" />}
            disabled
            required
            className="bg-surface-hover/50 text-muted-foreground select-none opacity-80"
          />

          <Input
            label={t.portal.companyProfile.businessCategory}
            name="businessCategory"
            value={formData.businessCategory}
            onChange={handleChange}
            icon={<Tag className="w-5 h-5" />}
            disabled={isViewOnly}
            required
            className={isViewOnly ? 'bg-surface-hover/50 text-muted-foreground select-none opacity-80' : ''}
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
            className={isViewOnly ? 'bg-surface-hover/50 text-muted-foreground select-none opacity-80' : ''}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 pt-2">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isViewOnly ? 'text-muted-foreground' : 'text-main'}`}>
               Company Business Type (B2C/B2B)
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
                  ${isViewOnly ? 'bg-surface-hover/50 border-border/50 text-muted-foreground select-none opacity-80 cursor-not-allowed' : 'bg-surface border-border text-main focus:border-brand focus:ring-1 focus:ring-brand hover:border-border-hover'}
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
