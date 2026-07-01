import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, QueryResult, QueryResultRow } from 'pg';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('DATABASE_HOST', 'postgres');
    const port = this.configService.get<number>('DATABASE_PORT', 5432);
    const user = this.configService.get<string>(
      'DATABASE_USER',
      'ticketbox_user',
    );
    const password = this.configService.get<string>(
      'DATABASE_PASSWORD',
      'ticketbox_password',
    );
    const database = this.configService.get<string>(
      'DATABASE_NAME',
      'ticketbox_db',
    );

    this.pool = new Pool({
      host,
      port: Number(port),
      user,
      password,
      database,
      // Tối ưu hóa Pool kết nối cho tải cao
      max: 80,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }

  async onModuleInit() {
    await this.connectWithRetry();
    await this.runMigrations();
  }

  async onModuleDestroy() {
    this.logger.log('Closing database connection pool...');
    await this.pool.end();
  }

  private async connectWithRetry(retries = 5, delayMs = 2000): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const client = await this.pool.connect();
        client.release();
        this.logger.log('Successfully connected to PostgreSQL database!');
        return;
      } catch (error) {
        const err = error as Error;
        this.logger.warn(
          `Failed to connect to database (attempt ${attempt}/${retries}). Error: ${err.message}`,
        );
        if (attempt === retries) {
          throw new Error(
            'Could not establish database connection after multiple retries.',
          );
        }
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  private async runMigrations(): Promise<void> {
    const client = await this.pool.connect();
    try {
      this.logger.log('Starting database migrations and seeding...');

      // Đọc và thực thi schema.sql
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schemaSql = await fs.readFile(schemaPath, 'utf8');
      this.logger.log(`Running schema migration from ${schemaPath}`);
      await client.query(schemaSql);

      // Đọc và thực thi seed.sql
      const seedPath = path.join(__dirname, 'seed.sql');
      const seedSql = await fs.readFile(seedPath, 'utf8');
      this.logger.log(`Running database seeding from ${seedPath}`);
      await client.query(seedSql);

      this.logger.log('Migrations and seeding completed successfully!');
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Database initialization error: ${err.message}`,
        err.stack,
      );
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Phương thức thực hiện truy vấn SQL chung
   */
  async query<T extends QueryResultRow = any>(
    text: string,
    params?: any[],
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }

  /**
   * Lấy client từ pool cho các xử lý transactions phức tạp
   */
  async getClient() {
    return this.pool.connect();
  }
}
