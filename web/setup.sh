#!/bin/bash
sudo dnf upgrade --refresh
sudo dnf install -y npm

npm install typescript
npm install react
npm install react-dom
npm install react-scripts --legacy-peer-deps
npm install react-router-dom
npm install --save-dev @types/react-router-dom
npm install @supabase/supabase-js