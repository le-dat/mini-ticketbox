import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

interface TicketRow {
  id: number;
  hold_expires_at: Date;
}

interface CountRow {
  count: number;
}

export interface TicketType {
  id: number;
  name: string;
  price: number;
}

export interface HeldTicket {
  id: number;
  ticket_type_id: number;
  user_id: string;
  hold_expires_at: Date;
}

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);
  private cachedTicketTypes: TicketType[] | null = null;

  constructor(private readonly db: DatabaseService) {}

  /**
   * Safely hold a ticket using FOR UPDATE SKIP LOCKED
   */
  async holdTicket(
    ticketTypeId: number,
    userId: string,
  ): Promise<{ ticketId: number; expiresAt: Date }> {
    const query = `
      UPDATE tickets
      SET
        status          = 'HELD',
        user_id         = $1,
        hold_expires_at = NOW() + INTERVAL '5 minutes',
        held_at         = NOW()
      WHERE id = (
        SELECT id FROM tickets
        WHERE ticket_type_id = $2
          AND (
            status = 'AVAILABLE'
            OR (status = 'HELD' AND hold_expires_at < NOW())
          )
        ORDER BY id ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      )
      RETURNING id, hold_expires_at;
    `;

    try {
      const result = await this.db.query<TicketRow>(query, [
        userId,
        ticketTypeId,
      ]);

      if (result.rows.length === 0) {
        throw new ConflictException({
          code: 'SOLD_OUT',
          message:
            'No available tickets of this type or all tickets are currently held.',
        });
      }

      return {
        ticketId: result.rows[0].id,
        expiresAt: result.rows[0].hold_expires_at,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      const err = error as Error;
      this.logger.error(`Error holding ticket: ${err.message}`, err.stack);
      throw error;
    }
  }

  /**
   * Count tickets by status and ticket type ID
   */
  async getTicketsCount(ticketTypeId: number, status: string): Promise<number> {
    const query = `
      SELECT COUNT(*)::int as count FROM tickets
      WHERE ticket_type_id = $1 AND status = $2;
    `;
    const result = await this.db.query<CountRow>(query, [ticketTypeId, status]);
    return result.rows[0]?.count || 0;
  }

  /**
   * Reset all tickets status for test suite cleanup purposes
   */
  async resetAllTickets(): Promise<void> {
    const query = `
      UPDATE tickets
      SET
        status          = 'AVAILABLE',
        user_id         = NULL,
        hold_expires_at = NULL,
        held_at         = NULL;
    `;
    await this.db.query(query);
    this.cachedTicketTypes = null;
    this.logger.log('All tickets status reset to AVAILABLE');
  }

  /**
   * Retrieve ticket types from ticket_types table (with in-memory caching)
   */
  async getTicketTypes(): Promise<TicketType[]> {
    if (this.cachedTicketTypes) {
      return this.cachedTicketTypes;
    }
    const query = `
      SELECT id, name, price::float as price FROM ticket_types
      ORDER BY id ASC;
    `;
    const result = await this.db.query<TicketType>(query);
    this.cachedTicketTypes = result.rows;
    return this.cachedTicketTypes;
  }

  /**
   * Retrieve currently held (HELD) and unexpired tickets
   */
  async getHeldTickets(): Promise<HeldTicket[]> {
    const query = `
      SELECT id, ticket_type_id, user_id, hold_expires_at FROM tickets
      WHERE status = 'HELD' AND hold_expires_at > NOW()
      ORDER BY hold_expires_at ASC;
    `;
    const result = await this.db.query<HeldTicket>(query);
    return result.rows;
  }
}
