#!/bin/bash
cd ../web
npm run build
cd ../web-server
rm -rf staticfiles
python3 manage.py collectstatic