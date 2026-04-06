import { useState } from 'react';
import { UserPlus, Mail } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

interface InviteUserFormProps {
  onInvite: (email: string, role: string) => Promise<void>;
  isInviting: boolean;
}

export default function InviteUserForm({ onInvite, isInviting }: InviteUserFormProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('ADMIN');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await onInvite(email, role);
    setEmail('');
  };

  return (
    <div className="bg-surface border border-border shadow-sm rounded-3xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16 pointer-events-none" />

      <h2 className="text-lg font-bold text-main flex items-center gap-2 mb-6">
        <UserPlus className="w-5 h-5 text-brand" />
        Invite User
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-5 h-5" />}
          placeholder="colleague@company.com"
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-main">Role</label>
          <div className="relative">
            <select
              className="w-full pl-4 pr-10 py-3 bg-surface border border-input rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-main cursor-pointer appearance-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="ADMIN">Admin</option>
              <option value="ACCOUNT_MANAGER">Account Manager</option>
            </select>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-2"
          isLoading={isInviting}
          disabled={!email}
        >
          Send Invitation
        </Button>
      </form>
    </div>
  );
}
