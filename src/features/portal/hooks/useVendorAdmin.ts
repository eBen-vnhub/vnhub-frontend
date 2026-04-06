import { useState, useEffect, useCallback } from 'react';
import { usePermissions } from '../../../hooks/usePermissions';
import vendorsService from '../../../services/vendors';
import type { User } from '../../../types';
import toast from 'react-hot-toast';

export function useVendorAdmin() {
  const { canManageTeam } = usePermissions();
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviting, setIsInviting] = useState(false);

  const fetchTeam = useCallback(async () => {
    if (!canManageTeam) {
      setIsLoading(false);
      return;
    }
    try {
      const data = await vendorsService.getTeamMembers();
      setTeamMembers(data);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to fetch team members');
    } finally {
      setIsLoading(false);
    }
  }, [canManageTeam]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const handleInvite = async (email: string, role: string) => {
    setIsInviting(true);
    try {
      await vendorsService.inviteTeamMember({ email, role });
      toast.success('Invitation sent successfully');
      fetchTeam();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemove = async (targetId: string) => {
    if (!window.confirm('Are you sure you want to remove this team member?')) return;
    try {
      await vendorsService.removeTeamMember(targetId);
      toast.success('User removed successfully');
      fetchTeam();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to remove user');
    }
  };

  return {
    teamMembers,
    isLoading,
    isInviting,
    canManageTeam,
    handleInvite,
    handleRemove,
  };
}
