import { useState, useEffect, useCallback, useRef } from 'react';
import { request } from '../services/api';

interface PreferencesData {
  preferences: Record<string, any>;
  updated_at: string;
}

let cachedPreferences: Record<string, any> | null = null;
let fetchPromise: Promise<Record<string, any>> | null = null;

async function fetchPreferences(): Promise<Record<string, any>> {
  if (cachedPreferences) return cachedPreferences;
  if (fetchPromise) return fetchPromise;

  fetchPromise = request<PreferencesData>('/auth/me/preferences/').then(data => {
    cachedPreferences = data.preferences || {};
    fetchPromise = null;
    return cachedPreferences;
  }).catch(() => {
    fetchPromise = null;
    cachedPreferences = null; // Do not cache empty on 401
    return {};
  });

  return fetchPromise;
}

let listeners: Array<(prefs: Record<string, any>) => void> = [];

function notifyListeners(prefs: Record<string, any>) {
  listeners.forEach(l => l(prefs));
}

export async function refetchPreferences() {
  cachedPreferences = null;
  const prefs = await fetchPreferences();
  notifyListeners(prefs);
  return prefs;
}

async function patchPreferences(partial: Record<string, any>): Promise<Record<string, any>> {
  const data = await request<PreferencesData>('/auth/me/preferences/', {
    method: 'PATCH',
    body: JSON.stringify({ preferences: partial }),
  });
  cachedPreferences = data.preferences || {};
  notifyListeners(cachedPreferences);
  return cachedPreferences;
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<Record<string, any>>(cachedPreferences || {});
  const [isLoading, setIsLoading] = useState(!cachedPreferences);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const listener = (prefs: Record<string, any>) => {
      setPreferences(prefs);
      setIsLoading(false);
    };
    listeners.push(listener);

    if (cachedPreferences) {
      setPreferences(cachedPreferences);
      setIsLoading(false);
    } else {
      fetchPreferences().then(prefs => {
        setPreferences(prefs);
        setIsLoading(false);
      });
    }

    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const updatePreference = useCallback((key: string, value: any) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    cachedPreferences = updated;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      patchPreferences({ [key]: value }).catch(() => {});
    }, 500);
  }, [preferences]);

  const getPreference = useCallback(<T = any>(key: string, defaultValue: T): T => {
    return preferences[key] !== undefined ? preferences[key] : defaultValue;
  }, [preferences]);

  return { preferences, isLoading, updatePreference, getPreference };
}
