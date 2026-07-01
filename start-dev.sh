#!/bin/bash
set -e

echo "=========================================================="
echo "🚀 Starting Mini TicketBox Docker Containers..."
echo "=========================================================="

# Start docker-compose referencing the files inside the docker/ folder, maintaining the project name.
# --env-file loads .env from project root so ${VAR} placeholders in compose files are resolved.
docker compose -p nam-viet --env-file .env -f docker/docker-compose.yml -f docker/docker-compose.override.yml up -d

echo ""
echo "✅ Docker containers started successfully!"
echo "----------------------------------------------------------"
echo "🌐 Frontend : http://localhost:5173"
echo "🔌 Backend  : http://localhost:3000"
echo "=========================================================="
