#!/usr/bin/env bash

# Stop any running instance of the application
pm2 delete GroupThirteen

# Fetch the latest changes from the remote repository
git fetch --all

# Reset the local branch to match the remote main branch
git reset --hard origin/main

# Install npm dependencies
npm install

# Set up the private key and server certificate
echo $PRIVATE_KEY > privatekey.pem
echo $SERVER > server.crt

# Start the application with pm2
pm2 start ./bin/www --name GroupThirteen
