#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Resolve the script directory and cd into it to ensure relative path robustness
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Load environment variables from root .env file
ROOT_DIR="$(cd "$SCRIPT_DIR/../../../" && pwd)"
if [ -f "$ROOT_DIR/.env" ]; then
  # Export only lines that are variable assignments, skip comments
  set -a
  # shellcheck source=/dev/null
  source "$ROOT_DIR/.env"
  set +a
fi

echo "=========================================================="
echo "🚀 Mini TicketBox - Concurrency Load Test Runner"
echo "=========================================================="

# Step 1: Reset the Database
echo "🧹 Step 1: Resetting database to default state (500 tickets, 0 orders)..."
docker exec -i ticketbox-backend npm run db:reset
echo "✅ Database reset complete!"
echo ""

# Step 2: Run k6 Load Test
echo "🔥 Step 2: Executing load test (5,000 VUs, 1 iteration each)..."
if command -v k6 &> /dev/null; then
    echo "ℹ️ Local k6 installation found. Running test locally..."
    k6 run loadtest.js
else
    echo "ℹ️ Local k6 not found. Running load test via Docker container (grafana/k6)..."
    docker run --rm -i --network=host -v "$(pwd):/app" -w /app grafana/k6 run loadtest.js
fi
echo "✅ Load test execution complete!"
echo ""

# Step 3: Query Database to Verify Consistency
echo "📊 Step 3: Querying database to verify ticket limits and consistency..."
echo "----------------------------------------------------------"
echo "🎟️ Ticket status count (SOLD must be <= 500, no AVAILABLE/HELD VIP/Regular if sold out):"
docker exec -i ticketbox-db psql -U "$DATABASE_USER" -d "$DATABASE_NAME" -c "
  SELECT status, COUNT(*) FROM tickets GROUP BY status;
"

echo "----------------------------------------------------------"
echo "🔗 Matching count validation (sold_tickets and paid_orders MUST be equal):"
docker exec -i ticketbox-db psql -U "$DATABASE_USER" -d "$DATABASE_NAME" -c "
  SELECT 
    (SELECT COUNT(*) FROM tickets WHERE status = 'SOLD') as sold_tickets,
    (SELECT COUNT(*) FROM orders WHERE status = 'PAID') as paid_orders;
"
echo "=========================================================="
echo "✅ Verification complete! Please review the numbers above."
echo "=========================================================="
