#!/bin/bash
source venv/bin/activate

# Collect static react files.
cd ../web
npm install package.json
npm run build
cd ../web-server
rm -rf staticfiles
python3 manage.py collectstatic

# Run
daphne -b 127.0.0.1 -p 8000 courier_web_server.asgi:application
