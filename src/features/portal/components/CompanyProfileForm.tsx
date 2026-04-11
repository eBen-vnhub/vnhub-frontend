import { Building, Globe, MapPin, Tag, Lock } from 'lucide-react';
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

  return (
    <div className="bg-surface border border-border shadow-sm rounded-3xl p-6 sm:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-main flex items-center gap-2">
            <Building className="w-5 h-5 text-brand" />
            {t.portal.companyProfile.title}
          </h2>
          <p className="text-sm text-muted mt-1">{t.portal.companyProfile.subtitle}</p>
        </div>
        {!canEditCompanyProfile && (
          <div className="inline-flex items-center gap-2 bg-surface-hover/50 border border-border px-3 py-1.5 rounded-full">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{t.portal.companyProfile.viewOnlyMode}</span>
          </div>
        )}
      </div>

      {!canEditCompanyProfile && (
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
          <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
          <p className="text-sm text-blue-900 leading-relaxed text-left">
            <strong>{t.portal.companyProfile.restrictedAccess}</strong> {t.portal.companyProfile.restrictedMessage}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={t.portal.companyProfile.companyName}
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            icon={<Building className="w-5 h-5" />}
            disabled={!canEditCompanyProfile}
            required
            className={!canEditCompanyProfile ? 'bg-surface-hover/50 text-muted-foreground select-none' : ''}
          />

          <Input
            label={t.portal.companyProfile.headquartersCountry}
            name="companyCountry"
            value={formData.companyCountry}
            onChange={handleChange}
            icon={<MapPin className="w-5 h-5" />}
            disabled
            required
            className="bg-surface-hover/50 text-muted-foreground select-none"
          />

          <Input
            label={t.portal.companyProfile.businessCategory}
            name="businessCategory"
            value={formData.businessCategory}
            onChange={handleChange}
            icon={<Tag className="w-5 h-5" />}
            disabled={!canEditCompanyProfile}
            required
            className={!canEditCompanyProfile ? 'bg-surface-hover/50 text-muted-foreground select-none' : ''}
          />

          <Input
            label={t.portal.companyProfile.companyWebsite}
            name="companyWebsite"
            type="url"
            value={formData.companyWebsite}
            onChange={handleChange}
            icon={<Globe className="w-5 h-5" />}
            disabled={!canEditCompanyProfile}
            placeholder={t.portal.companyProfile.websitePlaceholder}
            className={!canEditCompanyProfile ? 'bg-surface-hover/50 text-muted-foreground select-none' : ''}
          />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className={`flex items-center gap-3 p-4 rounded-xl border ${!canEditCompanyProfile ? 'bg-surface-hover/50 border-border/50' : 'bg-surface border-border hover:border-brand/30'}`}>
            <input
              type="checkbox"
              id="businessTypeB2C"
              name="businessTypeB2C"
              checked={formData.businessTypeB2C}
              onChange={handleChange}
              disabled={!canEditCompanyProfile}
              className="w-5 h-5 rounded border-border text-brand focus:ring-brand accent-brand disabled:opacity-50"
            />
            <label htmlFor="businessTypeB2C" className={`text-sm font-medium flex items-center gap-2 ${!canEditCompanyProfile ? 'text-muted-foreground' : 'text-main'}`}>
              <Tag className="w-4 h-4 text-emerald-500" />
              {t.portal.companyProfile.b2c}
            </label>
          </div>

          <div className={`flex items-center gap-3 p-4 rounded-xl border ${!canEditCompanyProfile ? 'bg-surface-hover/50 border-border/50' : 'bg-surface border-border hover:border-brand/30'}`}>
            <input
              type="checkbox"
              id="businessTypeB2B"
              name="businessTypeB2B"
              checked={formData.businessTypeB2B}
              onChange={handleChange}
              disabled={!canEditCompanyProfile}
              className="w-5 h-5 rounded border-border text-brand focus:ring-brand accent-brand disabled:opacity-50"
            />
            <label htmlFor="businessTypeB2B" className={`text-sm font-medium flex items-center gap-2 ${!canEditCompanyProfile ? 'text-muted-foreground' : 'text-main'}`}>
              <Tag className="w-4 h-4 text-blue-500" />
              {t.portal.companyProfile.b2b}
            </label>
          </div>
        </div>

        {canEditCompanyProfile && (
          <div className="flex justify-end pt-4 border-t border-border">
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full sm:w-auto"
            >
              {t.portal.companyProfile.saveChanges}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
