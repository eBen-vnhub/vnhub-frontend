import { Building2, Check, Loader2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import vendorsService from '../../../services/vendors';
import { useState } from 'react';

export default function WorkspaceSelectionPage() {
  const { t, direction } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSwitching, setIsSwitching] = useState<number | null>(null);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const workspaces = user.workspaces || [];


  if (workspaces.length <= 1) {
    return <Navigate to="/portal" replace />;
  }

  const currentVendorId = user.vendor_profile?.id;

  const handleSelect = async (workspaceId: number) => {
    if (workspaceId === currentVendorId) {
      sessionStorage.setItem('workspace_selected', 'true');
      navigate('/portal');
      return;
    }

    setIsSwitching(workspaceId);
    try {
      await vendorsService.switchWorkspace(workspaceId);
      sessionStorage.setItem('workspace_selected', 'true');
      window.location.href = '/portal';
    } catch (err) {
      console.error(err);
      setIsSwitching(null);
    }
  };

  return (
    <div dir={direction} className="min-h-screen flex items-center justify-center p-4 bg-surface-hover">
      <div className="w-full max-w-lg bg-surface rounded-3xl shadow-xl flex flex-col overflow-hidden p-8 border border-border">

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand shadow-sm">
            <Building2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-main">{t.portal.workspace.selectWorkspace || 'Select a Workspace'}</h2>
          <p className="text-base text-muted mt-2">{t.portal.workspace.selectWorkspaceDesc || 'You belong to multiple workspaces. Please select one to continue.'}</p>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {workspaces.map(ws => {
            const isSelected = ws.id === currentVendorId;
            return (
              <button
                key={ws.id}
                onClick={() => handleSelect(ws.id)}
                disabled={isSwitching !== null}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all ${isSelected
                  ? 'border-brand bg-brand/5 shadow-sm ring-1 ring-brand/50'
                  : 'border-border hover:border-brand/40 bg-surface hover:bg-surface-hover'
                  }`}
              >
                <div className={`w-12 h-12 rounded-xl flex flex-shrink-0 items-center justify-center ${isSelected ? 'bg-brand text-white shadow-md' : 'bg-brand/10 text-brand'
                  }`}>
                  {isSwitching === ws.id ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Building2 className="w-6 h-6" />
                  )}
                </div>

                <div className="flex-1 text-start min-w-0">
                  <p className="text-base font-bold text-main truncate">{ws.company_name}</p>
                  <p className="text-sm text-muted truncate">{ws.company_country}</p>
                </div>

                <div className="flex-shrink-0 pl-2">
                  {isSelected ? (
                    <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
                      <Check className="w-5 h-5 text-brand" />
                    </div>
                  ) : (
                    <ArrowRight className="w-5 h-5 text-muted-dark opacity-0 group-hover:opacity-100 transition-opacity rtl:rotate-180" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
