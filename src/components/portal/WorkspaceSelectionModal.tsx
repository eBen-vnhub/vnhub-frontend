import { Building2, Check, Loader2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useVendors } from '../../contexts/VendorsContext';
import vendorsService from '../../services/vendors';
import { useState } from 'react';

interface WorkspaceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkspaceSelectionModal({ isOpen, onClose }: WorkspaceSelectionModalProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { vendor } = useVendors();
  const [isSwitching, setIsSwitching] = useState<number | null>(null);

  if (!isOpen || !user || !user.workspaces || user.workspaces.length <= 1) return null;

  const workspaces = user.workspaces;

  const handleSelect = async (workspaceId: number) => {
    if (workspaceId === vendor?.id) {
      onClose();
      return;
    }
    
    setIsSwitching(workspaceId);
    try {
      await vendorsService.switchWorkspace(workspaceId);
      window.location.reload();
    } catch (err) {
      console.error(err);
      setIsSwitching(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      />
      <div className="relative w-full max-w-md bg-surface rounded-3xl shadow-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 p-6">
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand shadow-sm">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-main">{t.portal.workspace.selectWorkspace || 'Select a Workspace'}</h2>
          <p className="text-sm text-muted mt-2">{t.portal.workspace.selectWorkspaceDesc || 'You belong to multiple workspaces. Please select one to continue.'}</p>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {workspaces.map(ws => (
            <button
              key={ws.id}
              onClick={() => handleSelect(ws.id)}
              disabled={isSwitching !== null}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                ws.id === vendor?.id 
                  ? 'border-brand bg-brand/5 shadow-sm' 
                  : 'border-border hover:border-brand/40 bg-surface'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex flex-shrink-0 items-center justify-center ${
                ws.id === vendor?.id ? 'bg-brand text-white' : 'bg-brand/10 text-brand'
              }`}>
                {isSwitching === ws.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                   <Building2 className="w-5 h-5" />
                )}
              </div>
              
              <div className="flex-1 text-start min-w-0">
                <p className="text-sm font-bold text-main truncate">{ws.company_name}</p>
                <p className="text-xs text-muted truncate">{ws.company_country}</p>
              </div>

              {ws.id === vendor?.id && (
                <Check className="w-5 h-5 text-brand flex-shrink-0" />
              )}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
