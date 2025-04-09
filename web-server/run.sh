#!/bin/bash

daphne -b 0.0.0.0 -p 8000 courier_web_server.asgi:application
