import { Link } from 'react-router-dom';
import { Building2, MapPin, Tag, ArrowRight, Activity, Users } from 'lucide-react';
import type { BackofficeVendorSummary } from '../../../../services/backoffice';

interface Props {
  vendors: BackofficeVendorSummary[];
  isLoading: boolean;
}

export default function VendorsTable({ vendors, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse bg-surface h-24 rounded-2xl border border-border" />
        ))}
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="bg-surface rounded-2xl p-12 text-center border border-border">
        <Building2 className="w-12 h-12 text-muted mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-main mb-2">No Vendors Available</h3>
        <p className="text-muted">There are currently no registered vendors in the system.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {vendors.map((vendor) => (
        <div
          key={vendor.id}
          className="group bg-surface hover:bg-surface-hover/80 border border-border hover:border-brand/30 rounded-2xl p-5 transition-all duration-300 flex items-center justify-between"
        >
          <div className="flex items-center gap-5 flex-1 min-w-0">
            <div className="w-14 h-14 rounded-xl bg-brand/10 text-brand flex items-center justify-center font-bold text-xl flex-shrink-0">
              {vendor.companyName?.charAt(0) || 'V'}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-bold text-main text-lg truncate">
                  {vendor.companyName || 'Unnamed Vendor'}
                </h3>
                {vendor.latestStatus && (
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${vendor.latestStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                    vendor.latestStatus === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                    {vendor.latestStatus}
                  </span>
                )}
              </div>

              <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
                {vendor.companyCountry && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{vendor.companyCountry}</span>
                  </div>
                )}

                {vendor.businessCategory && (
                  <div className="flex items-center gap-1.5 border-l border-border pl-4">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{vendor.businessCategory}</span>
                  </div>
                )}

                <div className="flex items-center gap-1.5 border-l border-border pl-4">
                  <Activity className="w-3.5 h-3.5" />
                  <span>{vendor.subscriptionCount} Subscription(s)</span>
                </div>

                <div className="flex items-center gap-1.5 border-l border-border pl-4">
                  <Users className="w-3.5 h-3.5" />
                  <span>{vendor.teamCount} Member(s)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="ml-4 flex-shrink-0">
            <Link
              to={`/backoffice/vendors/${vendor.id}`}
              className="w-10 h-10 rounded-full bg-brand/5 hover:bg-brand text-brand hover:text-white flex items-center justify-center transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
