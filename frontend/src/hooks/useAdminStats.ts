import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/order.service';
import type { AdminStats } from '../types';

export const useAdminStats = (isActive: boolean) => {
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [isAdminLoading, setIsAdminLoading] = useState<boolean>(false);

  const fetchAdminStats = useCallback(async () => {
    try {
      setIsAdminLoading(true);
      const data = await orderService.getAdminStats();
      setAdminStats(data);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    } finally {
      setIsAdminLoading(false);
    }
  }, []);

  // Admin: fetch on tab entry + poll every 10s
  // Polling used here because there are only 1-2 admins -> 12 req/min is negligible.
  // Unlike client (5000 users) which must use WS-only to avoid overloading server.
  useEffect(() => {
    if (isActive) {
      fetchAdminStats();
      const interval = setInterval(fetchAdminStats, 10_000);
      return () => clearInterval(interval);
    }
  }, [isActive, fetchAdminStats]);

  return {
    adminStats,
    isAdminLoading,
    refetch: fetchAdminStats,
  };
};
