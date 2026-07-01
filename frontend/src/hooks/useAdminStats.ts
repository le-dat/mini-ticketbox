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
      console.error('Lỗi tải thống kê admin:', err);
    } finally {
      setIsAdminLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      fetchAdminStats();
      const interval = setInterval(fetchAdminStats, 3000);
      return () => clearInterval(interval);
    }
  }, [isActive, fetchAdminStats]);

  return {
    adminStats,
    isAdminLoading,
    refetch: fetchAdminStats,
  };
};
