import { useState, useEffect } from 'react';

const ADMIN_SESSION_KEY = 'mvp_tracker_admin_session';

export function useAdminSession() {
  const [isAdminSession, setIsAdminSession] = useState(() => {
    try {
      const stored = sessionStorage.getItem(ADMIN_SESSION_KEY);
      // If no stored value exists, default to true (auto-admin mode)
      if (stored === null) {
        return true;
      }
      return stored === 'true';
    } catch {
      // If sessionStorage fails, default to true (auto-admin mode)
      return true;
    }
  });

  useEffect(() => {
    try {
      if (isAdminSession) {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      } else {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
      }
    } catch (error) {
      console.error('Failed to update session storage:', error);
    }
  }, [isAdminSession]);

  const activateAdminSession = () => setIsAdminSession(true);
  const clearAdminSession = () => setIsAdminSession(false);

  return {
    isAdminSession,
    activateAdminSession,
    clearAdminSession,
  };
}
