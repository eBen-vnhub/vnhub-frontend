import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../../i18n/LanguageContext';

export default function SettingsTabs() {
  const { t } = useLanguage();

  const tabs = [
    { to: '/backoffice/settings/users', label: t.settings?.users || 'User Management' },
    { to: '/backoffice/settings/logs', label: t.settings?.logs || 'Activity Logs' },
  ];

  return (
    <div className="flex border-b border-border mb-6">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
              isActive
                ? 'border-brand text-brand'
                : 'border-transparent text-muted hover:text-main'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
