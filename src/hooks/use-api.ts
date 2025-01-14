import { useSession } from '@/providers/session-provider';
import apiClient from '@/lib/axios';
import { useEffect } from 'react';

export function useApi() {
  const { token } = useSession();

  useEffect(() => {
    if (token) {
      localStorage.setItem('kc_token', token);
    }
  }, [token]);

  return apiClient;
} 