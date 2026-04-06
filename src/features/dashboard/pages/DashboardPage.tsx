import { useAuth } from '../../../contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-border-subtle p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-main mb-2">
          {user?.companyName}
        </h2>
        <p className="text-muted">
          {user?.firstName} {user?.lastName}
        </p>
      </div>
    </div>
  );
}
