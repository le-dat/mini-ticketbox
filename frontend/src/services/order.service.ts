import { apiClient } from './api-client';
import type { Order, AdminStats } from '../types';

export const orderService = {
  async createOrder(ticketId: number, userId: string, amount: number): Promise<Order> {
    const res = await apiClient.post<Order>('/api/orders', {
      ticket_id: ticketId,
      user_id: userId,
      amount,
    });
    return res.data;
  },

  async getAdminStats(): Promise<AdminStats> {
    const res = await apiClient.get<AdminStats>('/api/orders/stats');
    return res.data;
  },
};
