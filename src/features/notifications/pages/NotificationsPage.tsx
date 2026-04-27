import { useState, useEffect } from 'react';
import { Bell, Check, Loader2 } from 'lucide-react';
import { notificationsService } from '../../../services/notifications';
import type { Notification } from '../../../services/notifications';
import { useLanguage } from '../../../i18n/LanguageContext';
import { useNotifications } from '../../../hooks/useNotifications';

export default function NotificationsPage() {
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchNotifications = async (pageNum = 1) => {
    if (pageNum === 1) setIsLoading(true);
    try {
      const data = await notificationsService.getNotifications(pageNum);
      if (pageNum === 1) {
        setNotifications(data.results);
      } else {
        setNotifications(prev => [...prev, ...data.results]);
      }
      setHasMore(data.next !== null);
      setPage(pageNum);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setIsLoading(false);
    }
  };

  useNotifications(() => {
    fetchNotifications(1);
  });

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchNotifications(page + 1);
    }
  };

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
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-main flex items-center gap-2">
            <Bell className="w-6 h-6 text-brand" />
            {language === 'ar' ? 'الإشعارات' : 'Notifications'}
          </h1>
          <p className="text-muted mt-1">
            {language === 'ar' ? 'عرض جميع إشعارات النظام الخاص بك' : 'View all your system notifications'}
          </p>
        </div>
        <button
          onClick={markAllRead}
          className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-hover text-brand font-bold rounded-xl transition-all border border-border"
        >
          <Check className="w-4 h-4" />
          {language === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all read'}
        </button>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        {isLoading && page === 1 ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-brand animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-brand/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-brand/40" />
            </div>
            <h3 className="text-lg font-bold text-main mb-2">
              {language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}
            </h3>
            <p className="text-muted">
              {language === 'ar' ? 'أنت على اطلاع دائم. لا يوجد جديد.' : "You're all caught up. Nothing new here."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="divide-y divide-border">
              {notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`p-6 transition-colors ${notification.is_read ? 'bg-surface hover:bg-surface-hover/50' : 'bg-brand/5'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notification.is_read ? 'bg-gray-100' : 'bg-brand/10'}`}>
                      <Bell className={`w-5 h-5 ${notification.is_read ? 'text-gray-400' : 'text-brand'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-base ${notification.is_read ? 'text-gray-700 font-semibold' : 'text-main font-bold'}`}>
                        {language === 'ar' && notification.title_ar ? notification.title_ar : notification.title}
                      </p>
                      <p className="text-sm text-muted mt-1">
                        {language === 'ar' && notification.message_ar ? notification.message_ar : notification.message}
                      </p>
                      <p className="text-xs text-muted/60 mt-2">
                        {new Date(notification.created_at).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <button
                        onClick={() => markRead(notification.id)}
                        className="px-3 py-1.5 text-xs font-bold text-brand hover:bg-brand/10 rounded-lg transition-colors flex-shrink-0"
                      >
                        {language === 'ar' ? 'مقروء' : 'Mark Read'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {hasMore && (
              <div className="p-6 border-t border-border flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-surface border border-border hover:bg-surface-hover text-brand font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {language === 'ar' ? 'عرض المزيد' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
