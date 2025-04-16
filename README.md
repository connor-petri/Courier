# Courier - An AI assistant for D&D

## Project Description

Courier is a student project that aims to create a DM assistant tool for Dungeons & Dragons games. The tool listens to ongoing gameplay sessions, or even just the DM’s audio, and processes the audio in real-time to provide DMs with relevant game information, rules, and references when they need them.

## Project Goals

- Develop a working prototype that can capture and process audio from D&D sessions.
- Create a system that recognizes key D&D terms and phrases from spoken conversation.
- Build a basic database of commonly referenced D&D rules, information, and stats.
- Design a simple interface to display relevant information to the DM.
- Successfully demonstrate real-time information retrieval during a test gaming session.
- Make a discord bot that joins calls and uses the call audio as the website uses it’s audio input.

## Tech Stack

- **Backend:** Python with Django for handling server-side operations and API endpoints. Chosen for it’s support for websockets.
- **Container Infrastructure:**
    - Docker for containerization and consistent deployment
    - Kubernetes (k8s) for container orchestration and scaling
- **Database:** PostgreSQL for storing game rules, reference materials, and user data.
- **Automation:**
    - n8n for workflow automation
    - Flux for GitOps deployment
    - ARC-runners for CI/CD pipelines
- **Frontend:** React w/ Typescript
- **Additional Libraries:**
    - Speech recognition libraries for audio processing
    - Natural Language Processing (NLP) tools for understanding context
    
    All of this will be deployed to a raspberry pi cluster that I own.
    

## Front End

The front end of this project will be a React app made using TypeScript.

### Requirements

The website must have the following capabilities:

- Allow the user to log in, log out, and register.
- Stream Audio Blobs to the server through a Websocket
- Display server-generated DM resources to the user.
- Remove unused resources automatically.

## Back End
