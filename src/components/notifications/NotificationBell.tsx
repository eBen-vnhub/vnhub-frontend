import { useState, useEffect, useRef } from 'react';
import { Bell, Check } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { notificationsService } from '../../services/notifications';
import type { Notification } from '../../services/notifications';
import { useLanguage } from '../../i18n/LanguageContext';

export default function NotificationBell() {
  const { language } = useLanguage();
  const location = useLocation();
  const isPortal = location.pathname.startsWith('/portal');
  const viewAllLink = isPortal ? '/portal/notifications' : '/backoffice/notifications';
  
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const data = await notificationsService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const displayNotifications = notifications.slice(0, 5);

  const markAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length === 0) return;

    try {
      await notificationsService.markAsRead(unreadIds);
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Failed to mark notifications as read', err);
    }
  };

  const markRead = async (id: string | number) => {
    try {
      await notificationsService.markAsRead([id]);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0) {
          }
        }}
        className="relative p-2 text-gray-500 hover:text-brand hover:bg-brand/10 rounded-full transition-colors focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className={`absolute top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 ${language === 'ar' ? 'left-0' : 'right-0'}`}>
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-gray-900">
              {language === 'ar' ? 'الإشعارات' : 'Notifications'}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-brand font-semibold hover:underline flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                {language === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all read'}
              </button>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {displayNotifications.length > 0 ? (
              displayNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors ${!notification.is_read ? 'bg-brand/5' : ''}`}
                  onClick={() => !notification.is_read && markRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="flex-1 min-w-0 cursor-pointer">
                      <p className={`text-sm ${!notification.is_read ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
                        {language === 'ar' ? notification.message_ar : notification.message_en}
                      </p>
                      <span className="text-xs text-gray-400 mt-1 block">
                        {new Date(notification.created_at).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}
                      </span>
                    </div>
                    {!notification.is_read && (
                      <div className="w-2 h-2 rounded-full bg-brand mt-1.5 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm flex flex-col items-center">
                <Bell className="w-8 h-8 mb-2 text-gray-300" />
                <p>{language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}</p>
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-center">
              <Link
                to={viewAllLink}
                className="text-sm text-brand font-semibold hover:underline"
                onClick={() => setIsOpen(false)}
              >
                {language === 'ar' ? 'عرض كل الإشعارات' : 'View all notifications'}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
