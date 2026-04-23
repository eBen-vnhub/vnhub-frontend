import { User, Phone } from 'lucide-react';

interface VendorAdminSectionProps {
  vl: any;
  listing: any;
}

export default function VendorAdminSection({ vl, listing }: VendorAdminSectionProps) {
  const admin = vl.administrator;
  const phones = vl.companyPhones;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-border pt-5">
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
          <User className="w-3 h-3" /> {listing.administrator}
        </span>
        <p className="text-sm text-main font-semibold">
          {admin.firstName} {admin.lastName}
        </p>
        <p className="text-xs text-muted">{admin.email}</p>
        <p className="text-xs text-muted">{admin.phoneCountryCode} {admin.phoneNumber}</p>
      </div>
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
          <Phone className="w-3 h-3" /> {listing.companyPhones}
        </span>
        {phones ? (
          <>
            <p className="text-sm text-main font-medium">{listing.landline}: {phones.hqLandlineCountryCode} {phones.hqLandlineNumber}</p>
            <p className="text-sm text-main font-medium">{listing.mobile}: {phones.companyMobileCountryCode} {phones.companyMobileNumber}</p>
          </>
        ) : (
          <p className="text-sm text-muted">{listing.noPhoneInfo}</p>
        )}
      </div>
    </div>
  );
}
