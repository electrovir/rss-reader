#!/bin/bash

set -e

backendPort=3001; while nc -z localhost $backendPort 2>/dev/null; do ((backendPort++)); done;

echo -e "\033[90m backend port: ${backendPort}\033[0m"

runstorm --max=2 --colors=green,blue --names=backend,frontend "PORT=${backendPort} npm run start --workspace @rss-reader/backend" "VITE_BACKEND_PORT=${backendPort} npm run start --workspace @rss-reader/frontend"
