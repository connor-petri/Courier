import speech_recognition as sr
import io
import asyncio
import wave

class KeywordDetector:
    def __init__(self, keywords: list[str] = [], buffer_size_seconds: int = 30, chunk_duration_ms: int = 250, processing_rate_ms: int = 1000):
        self.recognizer: sr.Recognizer = sr.Recognizer()
        self.keywords: list[str] = keywords
        self.max_chunks: int = buffer_size_seconds * 1000 // chunk_duration_ms
        self.processing_rate_ms: int = processing_rate_ms
        self.audio_queue: asyncio.Queue[bytes] = asyncio.Queue(maxsize=self.max_chunks)
        self.running: bool = True

        self._audio_task = asyncio.create_task(self._process_audio())

    
    async def stop(self):
        self.running = False
        self._audio_task.cancel()
        if self._audio_task:
            await self._audio_task


    async def push(self, data: bytes):
        if data:
            await self.audio_queue.put(data)


    async def _process_audio(self):
        loop = asyncio.get_event_loop()
        while self.running:
            await asyncio.sleep(self.processing_rate_ms / 1000)
            loop.run_in_executor(None, self._process_audio_sync)


    def _process_audio_sync(self):
        audio_buffer = io.BytesIO()

        temp_queue = []

        while not self.audio_queue.empty():
            chunk = self.audio_queue.get_nowait()
            temp_queue.append(chunk)
            audio_buffer.write(chunk)

        for chunk in temp_queue:
            self.audio_queue.put_nowait(chunk)

        audio_buffer.seek(0)

        wav_buffer = io.BytesIO()
        with wave.open(wav_buffer, 'wb') as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(44100)
            wav_file.writeframes(audio_buffer.read())

        wav_buffer.seek(0)

        with sr.AudioFile(wav_buffer) as source:
            audio = self.recognizer.record(source)
            try:
                transcription = self.recognizer.recognize_google(audio)
                print("Transcription:", transcription)
            except sr.UnknownValueError:
                print("Could not understand the audio")
            except sr.RequestError as e:
                print(f"Could not request results; {e}")