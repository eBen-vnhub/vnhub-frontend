import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import EbenLogo from '../ui/EbenLogo';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import WorkspaceSwitcher from './WorkspaceSwitcher';
import InlineSubscriptionModal from './InlineSubscriptionModal';
import { LogOut, ChevronDown, Lock, User as UserIcon } from 'lucide-react';

export default function Header() {
  const { user, displayName, logout } = useAuth();
  const { t, direction } = useLanguage();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50" dir={direction}>
        <div className="absolute inset-0 bg-white/95 backdrop-blur-xl border-b border-border-subtle" />

        <div className="relative px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/portal" className="flex items-center gap-3 group">
                <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center">
                  <EbenLogo />
                </div>
                <h1 className="text-lg font-bold text-main leading-none hidden sm:block">
                  VN Hub
                </h1>
              </Link>
            </div>

            <div className="flex items-center gap-3 ms-auto">
              <LanguageSwitcher />

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2.5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-surface-hover transition-all duration-300 group"
                >
                  <div className="hidden md:block text-end">
                    <p className="text-sm font-semibold text-main leading-tight">
                      {displayName}
                    </p>
                  </div>

                  <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center shadow-sm">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>

                  <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute end-0 mt-2 w-72 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-surface rounded-2xl border border-border shadow-2xl overflow-hidden">
                      <div className="px-5 py-4 bg-surface border-b border-border-subtle">
                        <p className="text-sm font-bold text-main text-center">
                          {displayName}
                        </p>
                        <p className="text-xs text-muted mt-0.5 text-center">
                          {user?.email}
                        </p>
                      </div>

                      <div className="block md:hidden px-3 pt-3">
                         <WorkspaceSwitcher onAddBranch={() => { setIsProfileMenuOpen(false); setShowBranchModal(true); }} />
                      </div>

                      <div className="p-2 space-y-0.5">
                        <Link
                          to="/portal/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold text-main hover:text-brand hover:bg-brand/5 rounded-xl transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 flex items-center justify-center bg-surface-hover rounded-lg group-hover:bg-brand/10 transition-all flex-shrink-0">
                            <UserIcon className="w-4 h-4" />
                          </div>
                          <span>{t.portal.header.myProfile}</span>
                        </Link>

                        <Link
                          to="/portal/change-password"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold text-main hover:text-brand hover:bg-brand/5 rounded-xl transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 flex items-center justify-center bg-surface-hover rounded-lg group-hover:bg-brand/10 transition-all flex-shrink-0">
                            <Lock className="w-4 h-4" />
                          </div>
                          <span>{t.portal.header.changePassword}</span>
                        </Link>

                        <div className="border-t border-border-subtle my-1" />

                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold text-error hover:bg-error/5 rounded-xl transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 flex items-center justify-center bg-surface-hover rounded-lg group-hover:bg-error/10 transition-all flex-shrink-0">
                            <LogOut className="w-4 h-4" />
                          </div>
                          <span>{t.portal.header.signOut}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="h-16" />

      <InlineSubscriptionModal
        isOpen={showBranchModal}
        onClose={() => setShowBranchModal(false)}
        onSuccess={() => {
          setShowBranchModal(false);
          window.location.reload();
        }}
        newBranch={true}
      />
    </>
  );
}
