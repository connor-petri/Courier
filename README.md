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

- **Backend:** Supabase will be used for user authentication and management as well as storing game rules and monster data for retrieval by the AI Agent.
- **Database:** Game rules, reference materials, and monster stats will be stored in a vectorized database in Supabase for ease of access by AI agents.
- **Automation:**
    - n8n for workflow automation and AI agents.
- **Frontend:** React w/ Typescript. This will record audio, send resource requests to n8n, take care of dictation and keyword detection, and display resources for the user.
- **Additional Components:**
    - ```react-speech-recognition``` for keyword detection.
    - Whisper hosted by Groq for audio transcription.
    
    All of this will be deployed to a raspberry pi cluster that I own.
    

