import os
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
import wave
import asyncio
import speech_recognition as sr
from .KeywordDetector import KeywordDetector

class AudioStreamConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Accept the WebSocket connection
        await self.accept()
        print("WebSocket connection established")

        os.makedirs('./audio', exist_ok=True)  # Ensure the audio directory exists

        self.audio_file = wave.open(f"./audio/{datetime.now().strftime('%Y%m%d_%H%M%S')}.wav", 'wb')
        self.audio_file.setnchannels(1) # Mono
        self.audio_file.setsampwidth(2) # 16-bit
        self.audio_file.setframerate(44100)

        self.kwd = KeywordDetector(buffer_size_seconds=30, chunk_duration_ms=250)

    async def disconnect(self, close_code):
        if hasattr(self, 'audio_file') and self.audio_file:
            self.audio_file.close()
        
        await self.kwd.stop()
        print("WebSocket connection closed with code:", close_code)

    async def receive(self, text_data=None, bytes_data: bytes=None):
        if bytes_data:
            print(f"Received audio data of size: {len(bytes_data)}")
            self.audio_file.writeframes(bytes_data)
            await self.kwd.push(bytes_data)
        