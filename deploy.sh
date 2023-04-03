#!/usr/bin/env bash
sudo apt update && sudo apt install nodejs npm
#Install pm2
sudo npm install -g pm2
#stop any instance currently running 
pm2 stop GroupThirteen
#change directory
cd NotesAppGroup13/
#install dependencies
npm install
npm install ejs
# Remove existing privatekey.pem and server.crt files
rm -f privatekey.pem server.crt
# Create privatekey.pem and server.crt from environment variables
echo $PRIVATE_KEY > privatekey.pem
echo $SERVER > server.crt
#start the app
#pm2 start ./bin/www --name GroupThirteen 
#pm2 restart GroupThirteen
git pull origin main
npm install
node app.js
