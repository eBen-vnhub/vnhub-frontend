import { User, Mail, Phone } from 'lucide-react';

interface Props {
  administrator: any;
}

export default function VendorAdminCard({ administrator }: Props) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-4">
      <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <User className="w-3.5 h-3.5" /> Administrator
      </h4>
      {administrator ? (
        <div className="space-y-2">
          <div className="font-bold text-main">
            {administrator.firstName} {administrator.lastName}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{administrator.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{administrator.phoneCountryCode} {administrator.phoneNumber}</span>
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted">No admin info available</div>
      )}
    </div>
  );
}
