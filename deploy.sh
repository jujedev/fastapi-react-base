#!/bin/bash
set -e

echo "🚀 Desplegando fastapi-react-base..."

docker compose down
docker compose up -d --build

echo "✅ Deploy completado."
echo "   App: http://localhost"
echo "   Logs: docker compose logs -f"
