#!/usr/bin/env bash

# Update the package list and install Node.js 14.x
sudo apt update
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install -y nodejs

# Install pm2
sudo npm install -g pm2

# Stop any running instance of the application
pm2 stop GroupThirteen

# Remove the old repository folder, if it exists
rm -rf NotesAppGroup13/

# Clone the latest version of the repository
git clone https://github.com/Group13-Devops/NotesAppGroup13.git

# Change to the repository folder
cd NotesAppGroup13/

#Pull most recent main branch 
git pull origin main

# Install npm dependencies
npm install

# Set up the private key and server certificate
echo $PRIVATE_KEY > privatekey.pem
echo $SERVER > server.crt

# Start (or restart) the application with pm2
#pm2 start ./bin/www --name GroupThirteen
node app.js
