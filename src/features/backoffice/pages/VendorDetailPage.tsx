import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Globe, Loader2, ShieldCheck, Tag, Users, Shield, UserCheck } from 'lucide-react';
import { useBackofficeVendors } from '../hooks/useBackofficeVendors';
import ListingsAggregatedView from '../components/vendors/ListingsAggregatedView';

function MemberRoleBadge({ role }: { role: string }) {
  const isPrimary = role === 'SUPER_ADMIN';
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
      isPrimary ? 'bg-brand/10 text-brand border border-brand/20' : 'bg-surface-hover text-muted border border-border'
    }`}>
      {isPrimary ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
      {isPrimary ? 'Primary Admin' : 'Standard User'}
    </span>
  );
}

export default function VendorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { vendorDetail, listingsData, isLoadingDetails, fetchVendorDetail } = useBackofficeVendors();

  useEffect(() => {
    if (id) fetchVendorDetail(id);
  }, [id, fetchVendorDetail]);

  if (isLoadingDetails) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  if (!vendorDetail) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-main mb-4">Vendor Not Found</h2>
        <button onClick={() => navigate('/backoffice/vendors')} className="text-brand hover:underline">
          Return to directory
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
      <div>
        <Link
          to="/backoffice/vendors"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-brand font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>
      </div>

      <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-sm border border-border">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand/20 to-brand/5 text-brand flex items-center justify-center font-bold text-4xl shadow-inner border border-brand/10">
            {vendorDetail.companyName?.charAt(0) || 'V'}
          </div>

          <div className="flex-1 text-center sm:text-start">
            <h1 className="text-3xl font-bold text-main mb-2">
              {vendorDetail.companyName || 'Unnamed Vendor'}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-muted">
              {vendorDetail.companyCountry && (
                <div className="flex items-center gap-1.5 bg-surface-hover px-3 py-1.5 rounded-lg">
                  <MapPin className="w-4 h-4 text-brand" />
                  <span className="font-medium">{vendorDetail.companyCountry}</span>
                </div>
              )}
              {vendorDetail.businessCategory && (
                <div className="flex items-center gap-1.5 bg-surface-hover px-3 py-1.5 rounded-lg">
                  <Tag className="w-4 h-4 text-brand" />
                  <span className="font-medium">{vendorDetail.businessCategory}</span>
                </div>
              )}
              {vendorDetail.companyWebsite && (
                <a href={vendorDetail.companyWebsite} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-surface-hover hover:bg-brand/10 hover:text-brand px-3 py-1.5 rounded-lg transition-colors">
                  <Globe className="w-4 h-4" />
                  <span className="font-medium">Website</span>
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-hover shadow-lg shadow-brand/20 transition-all">
              <ShieldCheck className="w-5 h-5" />
              Review & Approve
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-3xl p-6">
          <h3 className="text-lg font-bold text-main mb-4 flex items-center gap-2">
            <Building2 className="text-brand w-5 h-5" />
            Subscriptions ({vendorDetail.subscriptions.length})
          </h3>
          <div className="space-y-3">
            {vendorDetail.subscriptions.map((sub) => (
              <div key={sub.id} className="p-4 rounded-xl border border-border bg-surface-hover/30 flex justify-between items-center">
                <div>
                  <div className="font-bold text-main">{sub.plan} Plan</div>
                  <div className="text-xs text-muted mt-1">{sub.billingCycle} • {new Date(sub.createdAt).toLocaleDateString()}</div>
                </div>
                <span className="px-3 py-1 bg-brand/10 text-brand text-xs font-bold rounded-full uppercase tracking-wider">{sub.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-3xl p-6">
          <h3 className="text-lg font-bold text-main mb-4 flex items-center gap-2">
            <Users className="text-brand w-5 h-5" />
            Team Members ({vendorDetail.teamMembers.length})
          </h3>
          <div className="space-y-3">
            {vendorDetail.teamMembers.map((member) => (
              <div key={member.id} className="p-4 rounded-xl border border-border bg-surface-hover/30 flex justify-between items-center">
                <div>
                  <div className="font-bold text-main">{member.firstName} {member.lastName}</div>
                  <div className="text-xs text-muted mt-1">{member.email}</div>
                </div>
                <MemberRoleBadge role={member.role} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <ListingsAggregatedView data={listingsData} />
    </div>
  );
}
