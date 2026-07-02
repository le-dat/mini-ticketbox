-- 1. Bảng loại vé
CREATE TABLE IF NOT EXISTS ticket_types (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(50) NOT NULL UNIQUE, -- 'VIP', 'Regular'
  price      NUMERIC(10,2) NOT NULL
);

-- 2. Bảng vé vật lý (500 hàng ứng với 500 vé)
CREATE TABLE IF NOT EXISTS tickets (
  id              SERIAL PRIMARY KEY,
  ticket_type_id  INT REFERENCES ticket_types(id) ON DELETE CASCADE,
  status          VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE', -- 'AVAILABLE' | 'HELD' | 'SOLD'
  user_id         VARCHAR(100), -- ID định danh người dùng giữ vé (Session ID)
  held_at         TIMESTAMPTZ,
  hold_expires_at TIMESTAMPTZ,
  sold_at         TIMESTAMPTZ
);

-- 3. Bảng đơn hàng
CREATE TABLE IF NOT EXISTS orders (
  id         SERIAL PRIMARY KEY,
  ticket_id  INT REFERENCES tickets(id) ON DELETE RESTRICT,
  user_id    VARCHAR(100) NOT NULL,
  status     VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- 'PENDING' | 'PAID' | 'FAILED'
  amount     NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Thiết lập Index quan trọng
-- Tăng tốc độ lọc vé trống theo loại vé
CREATE INDEX IF NOT EXISTS idx_tickets_type_status ON tickets(ticket_type_id, status);

-- Tối ưu hóa việc tìm vé HELD hết hạn (Partial Index)
CREATE INDEX IF NOT EXISTS idx_tickets_hold_expires ON tickets(status, hold_expires_at)
  WHERE status = 'HELD';
