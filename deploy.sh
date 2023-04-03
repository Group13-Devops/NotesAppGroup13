#!/usr/bin/env bash
sudo apt update && sudo apt install nodejs npm
#Install pm2
sudo npm install -g pm2
#stop any instance currently running 
pm2 stop groupthirteen
#change directory
cd NotesAppGroup13/
#install dependencies
npm install
echo $PRIVATE_KEY > privatekey.pem
echo $SERVER > server.crt
#start the app
pm2 start ./bin/www --name groupthirteen 