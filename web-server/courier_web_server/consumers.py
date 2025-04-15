import os
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import speech_recognition as sr
from .audio_processor import process_audio
from multiprocessing import Queue, Process
import json

class AudioStreamConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Accept the WebSocket connection
        await self.accept()
        print("WebSocket connection established")

        os.makedirs('./audio', exist_ok=True)  # Ensure the audio directory exists

        self.audio_queue: Queue = None
        
        self.audio_processor: Process = None

    async def disconnect(self, close_code):
        # if hasattr(self, 'audio_file') and self.audio_file:
        #     self.audio_file.close()
        if self.audio_processor and self.audio_processor.is_alive():
            self.audio_queue.put("STOP")  # Signal the audio processing to stop
            self.audio_processor.join()
            print("WebSocket connection closed with code:", close_code)

    async def receive(self, text_data=None, bytes_data: bytes=None):
        if text_data:
            data = json.loads(text_data)

            print(type(data.get('sample_rate')))
            print(data.get('sample_width'))
            print(data.get('channels'))
            if isinstance(data.get('sample_rate'), int) and isinstance(data.get('sample_width'), int) and isinstance(data.get('channels'), int):
                self.audio_queue = Queue(maxsize=data['sample_rate'] * data['sample_width'] * data['channels'] * 3)
                self.audio_processor = Process(target=process_audio, args=(self.audio_queue, data['sample_rate'], data['sample_width'], data['channels']))
                self.audio_processor.start()
                print("Audio processor started")

        if bytes_data:
            #print(f"Received audio data of size: {len(bytes_data)}")
            # self.audio_file.writeframes(bytes_data)
            if self.audio_queue:
                self.audio_queue.put(bytes_data)