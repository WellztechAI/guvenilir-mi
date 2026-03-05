#!/bin/bash
# EC2 Deployment Script for Frontend

echo "Starting deployment on EC2 for Frontend..."

# 1. Ensure docker and docker-compose are installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    sudo apt-get update
    sudo apt-get install -y docker.io
    sudo usermod -aG docker $USER
fi

if ! docker compose version &> /dev/null; then
    echo "Installing Docker Compose Plugin..."
    sudo apt-get install -y docker-compose-v2 || sudo apt-get install -y docker-compose-plugin
fi

# 2. Check if .env.production file exists
if [ ! -f ".env.production" ]; then
    echo "WARNING: .env.production file not found. Please create it with your API URLs before starting."
    echo "You can copy .env.production.example to .env.production and fill in the values."
    # We don't exit here, maybe they baked it into the code though it's bad practice
fi

# 3. Create .env link for build context (Docker build uses .env by default if not specified in docker-compose build args)
# If .env.production exists, we temporarily link or copy it to .env so Vite can pick it up during the build process.
if [ -f ".env.production" ]; then
   cp .env.production .env
   echo "Copied .env.production to .env for the build step."
fi

# 4. Build and start containers
echo "Building and starting frontend container..."
docker compose config || true
docker compose up -d --build

# Optional: cleanup temporary .env if it was copied from production
# rm -f .env

echo "Deployment finished. Frontend should be running on port 80."
