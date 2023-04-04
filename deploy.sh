#!/usr/bin/env bash

# Update the package list and install Node.js 14.x
sudo apt update
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install -y nodejs npm

# Install pm2
sudo npm install -g pm2

# Stop any running instance of the application
pm2 delete GroupThirteen

# Remove the old repository folder, if it exists
rm -rf NotesAppGroup13/
if [ $? -eq 0 ]; then
  echo "Successfully removed old repository folder"
else
  echo "Failed to remove old repository folder"
  exit 1
fi

# Clone the latest version of the repository
git clone https://github.com/Group13-Devops/NotesAppGroup13.git

# Change to the repository folder
cd NotesAppGroup13/
echo "Latest commit:"
git log -1 --oneline

# Install npm dependencies
npm install

# Set up the private key and server certificate
echo $PRIVATE_KEY > privatekey.pem
echo $SERVER > server.crt

# Start the application with pm2
pm2 start ./bin/www --name GroupThirteen
