export interface HeldTicket {
  id: number;
  ticketTypeId: number;
  expiresAt: string; // ISO String from server
  userId: string;
  price: number;
  typeName: string;
}

export interface HeldTicketAdmin {
  id: number;
  ticket_type_id: number;
  user_id: string;
  hold_expires_at: string; // ISO String
}

export interface AdminStats {
  total_sold: number;
  total_revenue: number;
  total_held: number;
  heldTickets: HeldTicketAdmin[];
}

export interface Order {
  id: number;
  ticket_id: number;
  user_id: string;
  amount: number;
}
