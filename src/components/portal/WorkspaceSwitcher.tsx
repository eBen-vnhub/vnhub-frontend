import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Building2, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useVendors } from '../../contexts/VendorsContext';
import { useLanguage } from '../../i18n/LanguageContext';
import vendorsService from '../../services/vendors';
import type { Workspace } from '../../types';

interface WorkspaceSwitcherProps {
  onAddBranch?: () => void;
}

export default function WorkspaceSwitcher({ onAddBranch }: WorkspaceSwitcherProps) {
  const { user } = useAuth();
  const { vendor } = useVendors();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const workspaces: Workspace[] = user?.workspaces || [];
  const activeWorkspace = workspaces.find(w => w.id === vendor?.id);
  const displayName = activeWorkspace?.company_name || vendor?.companyName || '';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (workspaces.length <= 1 && !onAddBranch) {
    return null;
  }

  const handleSwitchWorkspace = async (workspaceId: number) => {
    setIsOpen(false);
    if (workspaceId === vendor?.id) return;
    
    try {
      await vendorsService.switchWorkspace(workspaceId);
      window.location.reload();
    } catch (err) {
      console.error('Failed to switch workspace', err);
    }
  };

  return (
    <div ref={dropdownRef} className="relative mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-border hover:border-brand/40 transition-all"
      >
        <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-brand" />
        </div>
        <div className="flex-1 text-start min-w-0">
          <p className="text-xs text-muted font-medium">{t.portal.workspace.currentWorkspace}</p>
          <p className="text-sm font-semibold text-main truncate">{displayName}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-surface border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 max-h-64 overflow-y-auto">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => handleSwitchWorkspace(ws.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  ws.id === vendor?.id
                    ? 'bg-brand/10 text-brand'
                    : 'hover:bg-surface-hover text-main'
                }`}
              >
                <div className="w-8 h-8 rounded-md bg-brand/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4 text-brand" />
                </div>
                <div className="flex-1 text-start min-w-0">
                  <p className="text-sm font-semibold truncate">{ws.company_name}</p>
                  <p className="text-xs text-muted">{ws.company_country}</p>
                </div>
                {ws.id === vendor?.id && <Check className="w-4 h-4 text-brand flex-shrink-0" />}
              </button>
            ))}
          </div>

          {onAddBranch && (
            <>
              <div className="border-t border-border" />
              <button
                onClick={() => {
                  setIsOpen(false);
                  onAddBranch();
                }}
                className="w-full flex items-center gap-3 px-5 py-3 text-brand hover:bg-surface-hover transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-semibold">{t.portal.workspace.addNewBranch}</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
