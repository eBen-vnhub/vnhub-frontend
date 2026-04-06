import { useAuth } from '../../../contexts/AuthContext';
import ChangePasswordForm from '../components/ChangePasswordForm';

export default function ChangePasswordPage() {
  const { user } = useAuth();
  const displayName = user?.firstName ? user.firstName : (user?.companyName || user?.email?.split('@')[0] || 'User');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto space-y-8">
      <section className="bg-gradient-to-br from-brand/10 to-brand/5 rounded-3xl p-8 border border-brand/10 text-center">
        <h1 className="text-2xl font-bold text-main leading-tight mb-2">
          Change Password
        </h1>
        <p className="text-muted">
          Update the password for <span className="font-semibold text-main">{displayName}</span> ({user?.email})
        </p>
      </section>

      <div className="bg-surface border border-border shadow-sm rounded-3xl p-8 sm:p-10">
        <h2 className="text-lg font-bold text-main mb-6">Security Settings</h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
