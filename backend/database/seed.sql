-- Seed Loại vé
INSERT INTO ticket_types (id, name, price) VALUES
(1, 'Regular', 500000.00),
(2, 'VIP', 1500000.00)
ON CONFLICT (name) DO NOTHING;

-- Seed 300 vé Regular + 200 vé VIP một cách idempotent (chỉ chạy nếu chưa có vé tương ứng)
INSERT INTO tickets (ticket_type_id)
SELECT 1 FROM generate_series(1, 300)
WHERE NOT EXISTS (
  SELECT 1 FROM tickets WHERE ticket_type_id = 1
);

INSERT INTO tickets (ticket_type_id)
SELECT 2 FROM generate_series(1, 200)
WHERE NOT EXISTS (
  SELECT 1 FROM tickets WHERE ticket_type_id = 2
);
