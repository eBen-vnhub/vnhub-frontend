import { Building, Globe, MapPin, Tag, Lock } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useCompanyProfile } from '../hooks/useCompanyProfile';
import type { Vendor } from '../../../types';

interface CompanyProfileFormProps {
  initialData: Vendor;
  onUpdate: (vendor: Vendor) => void;
}

export default function CompanyProfileForm({ initialData, onUpdate }: CompanyProfileFormProps) {
  const { formData, isSubmitting, canEditCompanyProfile, handleChange, handleSubmit } = useCompanyProfile(initialData, onUpdate);

  return (
    <div className="bg-surface border border-border shadow-sm rounded-3xl p-6 sm:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-main flex items-center gap-2">
            <Building className="w-5 h-5 text-brand" />
            Company Profile
          </h2>
          <p className="text-sm text-muted mt-1">Manage your business information.</p>
        </div>
        {!canEditCompanyProfile && (
          <div className="inline-flex items-center gap-2 bg-surface-hover/50 border border-border px-3 py-1.5 rounded-full">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">View Only Mode</span>
          </div>
        )}
      </div>

      {!canEditCompanyProfile && (
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
          <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
          <p className="text-sm text-blue-900 leading-relaxed text-left">
            <strong>Restricted Access:</strong> Only Super Admins have permission to modify company information. If you need to make changes, please contact your Super Admin.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            icon={<Building className="w-5 h-5" />}
            disabled={!canEditCompanyProfile}
            required
            className={!canEditCompanyProfile ? 'bg-surface-hover/50 text-muted-foreground select-none' : ''}
          />

          <Input
            label="Headquarters Country"
            name="companyCountry"
            value={formData.companyCountry}
            onChange={handleChange}
            icon={<MapPin className="w-5 h-5" />}
            disabled={!canEditCompanyProfile}
            required
            className={!canEditCompanyProfile ? 'bg-surface-hover/50 text-muted-foreground select-none' : ''}
          />

          <Input
            label="Business Category"
            name="businessCategory"
            value={formData.businessCategory}
            onChange={handleChange}
            icon={<Tag className="w-5 h-5" />}
            disabled={!canEditCompanyProfile}
            required
            className={!canEditCompanyProfile ? 'bg-surface-hover/50 text-muted-foreground select-none' : ''}
          />

          <Input
            label="Company Website"
            name="companyWebsite"
            type="url"
            value={formData.companyWebsite}
            onChange={handleChange}
            icon={<Globe className="w-5 h-5" />}
            disabled={!canEditCompanyProfile}
            placeholder="https://example.com"
            className={!canEditCompanyProfile ? 'bg-surface-hover/50 text-muted-foreground select-none' : ''}
          />
        </div>

        {canEditCompanyProfile && (
          <div className="flex justify-end pt-4 border-t border-border">
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full sm:w-auto"
            >
              Save Changes
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
