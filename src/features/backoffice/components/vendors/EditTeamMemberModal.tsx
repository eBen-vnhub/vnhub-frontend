import { useState, useEffect } from 'react';
import { X, Save, User as UserIcon } from 'lucide-react';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import type { BackofficeTeamMember } from '../../../../services/backoffice';

interface EditTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: BackofficeTeamMember | null;
  onUpdate: (userId: string | number, data: any) => Promise<boolean>;
}

export default function EditTeamMemberModal({ isOpen, onClose, user, onUpdate }: EditTeamMemberModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || 'STANDARD_USER',
      });
    }
  }, [user, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    const success = await onUpdate(user.id, formData);
    setIsSubmitting(false);
    if (success) onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-surface rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-bold text-main flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-brand" />
            Edit Team Member
          </h3>
          <button onClick={onClose} className="p-2 text-muted hover:text-main hover:bg-surface-hover rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block text-sm font-medium text-main mb-1.5">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-main outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
            >
              <option value="SUPER_ADMIN">Primary Admin</option>
              <option value="STANDARD_USER">Standard User</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3 rounded-b-3xl">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-full">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="flex items-center gap-2 rounded-full">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
