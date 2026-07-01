import { apiClient } from './api-client';

export interface HoldTicketResponse {
  ticketId: number;
  expiresAt: string;
}

export interface AvailableCountResponse {
  availableCount: number;
}

export const ticketService = {
  async holdTicket(ticketTypeId: number, userId: string): Promise<HoldTicketResponse> {
    const res = await apiClient.post<HoldTicketResponse>('/api/tickets/hold', {
      ticket_type_id: ticketTypeId,
      user_id: userId,
    });
    return res.data;
  },

  async getAvailableCount(ticketTypeId: number): Promise<number> {
    const res = await apiClient.get<AvailableCountResponse>(`/api/ticket-types/${ticketTypeId}/available`);
    return res.data.availableCount;
  },
};
