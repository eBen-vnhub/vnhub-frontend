import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Globe, Loader2, Tag, Users, Shield, UserCheck, Edit2, Package, Send, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBackofficeVendors } from '../hooks/useBackofficeVendors';
import { useLanguage } from '../../../i18n/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import ListingsAggregatedView from '../components/vendors/ListingsAggregatedView';
import EditTeamMemberModal from '../components/vendors/EditTeamMemberModal';
import RequestListingUpdateModal from '../components/onboarding/RequestListingUpdateModal';
import onboardingService from '../../../services/onboarding';
import type { BackofficeTeamMember } from '../../../services/backoffice';
import type { BenefitTracker } from '../../../types/onboarding';

const BENEFIT_STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-700',
  ASSIGNED_TO_OPS: 'bg-blue-50 text-blue-700',
  BUILDING: 'bg-indigo-50 text-indigo-700',
  IN_TESTING: 'bg-purple-50 text-purple-700',
  REVISION: 'bg-red-50 text-red-700',
  PENDING_LIVE: 'bg-amber-50 text-amber-700',
  LIVE: 'bg-emerald-50 text-emerald-700',
};

function MemberRoleBadge({ role, t }: { role: string; t: any }) {
  const isPrimary = role === 'SUPER_ADMIN';
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
      isPrimary ? 'bg-brand/10 text-brand border border-brand/20' : 'bg-surface-hover text-muted border border-border'
    }`}>
      {isPrimary ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
      {isPrimary ? t.backoffice.vendors.primaryAdmin : t.backoffice.vendors.standardUser}
    </span>
  );
}

function BenefitStatusBadge({ status, t }: { status: string; t: any }) {
  return (
    <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
      BENEFIT_STATUS_STYLES[status] || 'bg-gray-100 text-gray-600'
    }`}>
      {t.benefitTracker.status[status] || status}
    </span>
  );
}

export default function VendorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { vendorDetail, listingsData, isLoadingDetails, fetchVendorDetail, updateTeamMember } = useBackofficeVendors();
  const [editingMember, setEditingMember] = useState<BackofficeTeamMember | null>(null);
  const [benefits, setBenefits] = useState<BenefitTracker[]>([]);
  const [isRequestingUpdate, setIsRequestingUpdate] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const fetchBenefits = useCallback(async () => {
    if (!id) return;
    try {
      const data = await onboardingService.getBenefitTrackers(Number(id));
      setBenefits(data);
    } catch { /* */ }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchVendorDetail(id);
      fetchBenefits();
    }
  }, [id, fetchVendorDetail, fetchBenefits]);

  const handleRequestListingUpdate = async (feedback: string) => {
    if (!id) return;
    setIsRequestingUpdate(true);
    try {
      await onboardingService.requestVendorListingUpdate(Number(id), feedback);
      toast.success(t.benefitTracker.toast.listingUpdateRequested);
      setIsRequestModalOpen(false);
    } catch {
      toast.error(t.benefitTracker.toast.listingUpdateFailed);
    } finally {
      setIsRequestingUpdate(false);
    }
  };

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
        <h2 className="text-2xl font-bold text-main mb-4">{t.backoffice.vendors.vendorNotFound}</h2>
        <button onClick={() => navigate('/backoffice/vendors')} className="text-brand hover:underline">
          {t.backoffice.vendors.returnToDirectory}
        </button>
      </div>
    );
  }

  const canRequestUpdate = user?.role === 'SUPER_ADMIN' || user?.role === 'VSM';
  const canEditTeam = user?.role === 'SUPER_ADMIN' || user?.role === 'VSM';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/backoffice/vendors"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-brand font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.backoffice.vendors.backToDirectory}
        </Link>

        {canRequestUpdate && (
          <button
            onClick={() => setIsRequestModalOpen(true)}
            disabled={isRequestingUpdate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-sm font-semibold hover:bg-amber-100 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {t.benefitTracker.actions.requestListingUpdate}
          </button>
        )}
      </div>

      <RequestListingUpdateModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={handleRequestListingUpdate}
        companyName={vendorDetail?.companyName || ''}
      />

      <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-sm border border-border">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {(() => {
            const logoFile = listingsData?.vendorListing?.files?.find((f: any) => f.fileType === 'LOGO');
            return logoFile?.fileUrl ? (
              <div className="w-24 h-24 rounded-2xl bg-surface-hover border border-border flex items-center justify-center p-2 overflow-hidden">
                <img src={logoFile.fileUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand/20 to-brand/5 text-brand flex items-center justify-center font-bold text-4xl shadow-inner border border-brand/10">
                {vendorDetail.companyName?.charAt(0) || 'V'}
              </div>
            );
          })()}

          <div className="flex-1 text-center sm:text-start">
            <h1 className="text-3xl font-bold text-main mb-2">
              {vendorDetail.companyName || t.backoffice.vendors.unnamedVendor}
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
                  <span className="font-medium">{t.backoffice.listing.website}</span>
                </a>
              )}
            </div>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {user?.role !== 'OPERATIONS' && (
          <div className="bg-surface border border-border rounded-3xl p-6">
            <h3 className="text-lg font-bold text-main mb-4 flex items-center gap-2">
              <Building2 className="text-brand w-5 h-5" />
              {t.backoffice.vendors.subscriptions} ({vendorDetail.subscriptions.length})
            </h3>
            <div className="space-y-3">
              {vendorDetail.subscriptions.map((sub) => (
                <div key={sub.id} className="p-4 rounded-xl border border-border bg-surface-hover/30 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-main">{sub.plan} Plan</div>
                    <div className="text-xs text-muted mt-1">{sub.billingCycle} • {new Date(sub.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-surface border border-border rounded-3xl p-6">
          <h3 className="text-lg font-bold text-main mb-4 flex items-center gap-2">
            <Users className="text-brand w-5 h-5" />
            {t.backoffice.vendors.teamMembers} ({vendorDetail.teamMembers.length})
          </h3>
          <div className="space-y-3">
            {vendorDetail.teamMembers.map((member) => (
              <div 
                key={member.id} 
                className={`w-full p-4 rounded-xl border border-border bg-surface-hover/30 flex justify-between items-center transition-all ${canEditTeam ? 'hover:bg-surface-hover hover:border-brand/30 cursor-pointer group text-left' : ''}`}
                onClick={() => canEditTeam && setEditingMember(member)}
              >
                <div>
                  <div className={`font-bold text-main ${canEditTeam ? 'group-hover:text-brand transition-colors' : ''}`}>{member.firstName} {member.lastName}</div>
                  <div className="text-xs text-muted mt-1">{member.email}</div>
                </div>
                <div className="flex items-center gap-3">
                  <MemberRoleBadge role={member.role} t={t} />
                  {canEditTeam && <Edit2 className="w-4 h-4 text-muted group-hover:text-brand transition-colors opacity-0 group-hover:opacity-100" />}
                </div>
              </div>>
            ))}
          </div>
        </div>
      </div>

      {benefits.length > 0 && (
        <div className="bg-surface border border-border rounded-3xl p-6">
          <h3 className="text-lg font-bold text-main mb-4 flex items-center gap-2">
            <Package className="text-brand w-5 h-5" />
            {t.benefitTracker.title} ({benefits.length})
          </h3>
          <div className="space-y-3">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="p-4 rounded-xl border border-border bg-surface-hover/30 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-main">
                      {t.benefitTracker.benefitLabel} #{benefit.benefit_number}
                    </span>
                    <BenefitStatusBadge status={benefit.status} t={t} />
                  </div>
                  <div className="text-xs text-muted">
                    {benefit.subscription_plan} Plan • {new Date(benefit.created_at).toLocaleDateString()}
                    {benefit.assigned_ops_name && (
                      <span> • Ops: {benefit.assigned_ops_name}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {benefit.test_link && (
                    <a href={benefit.test_link} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {benefit.live_link && (
                    <a href={benefit.live_link} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {user?.role !== 'ADMIN' && <ListingsAggregatedView data={listingsData} />}

      <EditTeamMemberModal
        isOpen={!!editingMember}
        onClose={() => setEditingMember(null)}
        user={editingMember}
        onUpdate={updateTeamMember}
      />
    </div>
  );
}
