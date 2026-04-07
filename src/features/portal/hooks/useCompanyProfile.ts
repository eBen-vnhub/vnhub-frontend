import { useState } from 'react';
import { usePermissions } from '../../../hooks/usePermissions';
import { useLanguage } from '../../../i18n/LanguageContext';
import vendorsService from '../../../services/vendors';
import type { Vendor } from '../../../types';
import toast from 'react-hot-toast';

export function useCompanyProfile(initialData: Vendor, onUpdate: (vendor: Vendor) => void) {
  const { canEditCompanyProfile } = usePermissions();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: initialData.companyName || '',
    companyCountry: initialData.companyCountry || '',
    businessCategory: initialData.businessCategory || '',
    companyWebsite: initialData.companyWebsite || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditCompanyProfile) return;

    setIsSubmitting(true);
    try {
      const response = await vendorsService.updateDashboardData(formData);
      onUpdate(response.vendor);
      toast.success(t.portal.companyProfile.updateSuccess);
    } catch (err: any) {
      toast.error(err.response?.data?.error || t.portal.companyProfile.updateFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    canEditCompanyProfile,
    handleChange,
    handleSubmit,
  };
}
