#!/bin/bash
set -e

echo "=========================================================="
echo "🔥 Running Mini TicketBox Load Test Suite..."
echo "=========================================================="

# Trigger the runner script located in backend/test/load/
./backend/test/load/run-loadtest.sh
