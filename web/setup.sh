#!/bin/bash
sudo dnf upgrade --refresh
sudo dnf install -y git
sudo dnf install -y python3


sudo dnf install -y npm
npm install typescript
npm install react
npm install react-dom
npm install react-scripts --legacy-peer-deps
npm install react-router-dom
npm install --save-dev @types/react-router-dom

cd ../web-server
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt