import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../i18n/LanguageContext';

const WS_BASE = import.meta.env.VITE_WS_URL || (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.host + '/ws';

export function useNotifications(onNotificationReceived?: () => void) {
  const { isAuthenticated } = useAuth();
  const { direction } = useLanguage();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const wsUrl = `${WS_BASE}/notifications/`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'notification') {
          toast(data.message, {
            icon: '🔔',
            position: direction === 'rtl' ? 'top-left' : 'top-right',
            duration: 5000,
            className: 'bg-white text-main font-semibold border border-gray-200'
          });

          if (onNotificationReceived) {
            onNotificationReceived();
          }
        }
      } catch {
      }
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isAuthenticated, direction, onNotificationReceived]);

  return null;
}
