#!/usr/bin/env bash

# Print current working directory
echo "Current working directory: $(pwd)"

# Pull the latest changes from the repository
echo "Pulling latest changes from the repository..."
git pull origin main

# Print the latest commit
echo "Latest commit:"
git log -1 --oneline

# Install npm dependencies
echo "Installing npm dependencies..."
npm install

# Set up the private key and server certificate
echo "Setting up private key and server certificate..."
echo $PRIVATE_KEY > privatekey.pem
echo $SERVER > server.crt

# Start (or restart) the application with pm2
echo "Starting (or restarting) the application with pm2..."
pm2 restart GroupThirteen || pm2 start ./bin/www --name GroupThirteen
