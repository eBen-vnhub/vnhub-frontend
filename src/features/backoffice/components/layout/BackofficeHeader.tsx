import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import { useLanguage } from '../../../../i18n/LanguageContext';
import EbenLogo from '../../../../components/ui/EbenLogo';
import LanguageSwitcher from '../../../../components/ui/LanguageSwitcher';
import { LogOut, ChevronDown, User as UserIcon, Lock } from 'lucide-react';
import NotificationBell from '../../../../components/notifications/NotificationBell';

export default function BackofficeHeader() {
  const { user, displayName, logout } = useAuth();
  const { direction } = useLanguage();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
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
        <div className="absolute inset-0 bg-white/95 backdrop-blur-xl border-b border-gray-200" />

        <div className="relative px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/backoffice" className="flex items-center gap-3 group">
                <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center">
                  <EbenLogo />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-main leading-none">
                    VN Hub
                  </h1>
                  <span className="text-[10px] font-bold text-brand uppercase tracking-widest">
                    Administration
                  </span>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-3 ms-auto">
              <NotificationBell />
              <LanguageSwitcher />

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-300 group"
                >
                  <div className="hidden md:block text-end">
                    <p className="text-sm font-semibold text-gray-700 leading-tight">
                      {displayName}
                    </p>
                  </div>

                  <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center shadow-sm">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>

                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute end-0 mt-2 w-72 animate-slideDown">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
                      <div className="px-5 py-4 bg-white border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900 text-center">
                          {displayName}
                        </p>
                        <p className="text-xs text-brand mt-0.5 text-center font-semibold">
                          {user?.role?.replace(/_/g, ' ') || 'INTERNAL ADMIN'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 text-center">
                          {user?.email}
                        </p>
                      </div>

                      <div className="p-2 space-y-0.5">
                        <Link
                          to="/backoffice/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-700 hover:text-brand hover:bg-brand/5 rounded-xl transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg group-hover:bg-brand/10 transition-all flex-shrink-0">
                            <UserIcon className="w-4 h-4" />
                          </div>
                          <span className="font-semibold">My Profile</span>
                        </Link>

                        <Link
                          to="/backoffice/change-password"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-700 hover:text-brand hover:bg-brand/5 rounded-xl transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg group-hover:bg-brand/10 transition-all flex-shrink-0">
                            <Lock className="w-4 h-4" />
                          </div>
                          <span className="font-semibold">Change Password</span>
                        </Link>

                        <div className="border-t border-gray-100 my-1" />

                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg group-hover:bg-red-100 transition-all flex-shrink-0">
                            <LogOut className="w-4 h-4" />
                          </div>
                          <span className="font-semibold">Sign Out</span>
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
    </>
  );
}
