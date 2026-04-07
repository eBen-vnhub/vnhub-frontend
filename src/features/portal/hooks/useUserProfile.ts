import { useState, useEffect } from 'react';
import vendorsService from '../../../services/vendors';
import toast from 'react-hot-toast';
import { useLanguage } from '../../../i18n/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import type { User } from '../../../types';

export function useUserProfile() {
  const { t } = useLanguage();
  const { updateUser } = useAuth();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await vendorsService.getUserProfile();
        setUserProfile(data);
      } catch (err: any) {
        toast.error(t.common.error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [t.common.error]);

  const handleSubmit = async (e: React.FormEvent, formData: Partial<User>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await vendorsService.updateUserProfile(formData);
      setUserProfile(response.user);
      
      // Update global context
      updateUser(response.user);

      toast.success(t.portal.userProfile.updateSuccess);
    } catch (err: any) {
      toast.error(err.response?.data?.error || t.portal.userProfile.updateFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    userProfile,
    isLoading,
    isSubmitting,
    handleSubmit
  };
}
