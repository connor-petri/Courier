import sys
import wave
from datetime import datetime
import asyncio
from multiprocessing import Queue
import speech_recognition as sr

async def process_audio_async(queue: Queue):
    recognizer = sr.Recognizer()
    transcript = ""
    buffer = b""
    chunk_duration_seconds = 3
    sample_rate = 44100
    sample_width = 2
    bytes_per_second = sample_rate * sample_width
    chunk_size = bytes_per_second * chunk_duration_seconds
    print(f"Chunk size: {chunk_size} bytes")

    audio_file = wave.open(f"./audio/{datetime.now().strftime('%Y%m%d_%H%M%S')}.wav", 'wb')
    audio_file.setnchannels(1) # Mono
    audio_file.setsampwidth(2) # 16-bit
    audio_file.setframerate(44100)

    while True:
        if queue.empty():
            continue

        audio_data = queue.get()
        if audio_data == "STOP":
            break

        buffer += audio_data

        audio_file.writeframes(audio_data)

        if len(buffer) >= chunk_size:
            try:
                audio = sr.AudioData(buffer, sample_rate=44100, sample_width=2)
                text = recognizer.recognize_google(audio)
                transcript += f" {text}"
                print(f"Recognized text: {text}")
            except sr.UnknownValueError:
                print("Could not understand the audio")
            except sr.RequestError as e:
                print(f"Could not request results; {e}")
            finally:
                buffer = b""

    print("Final transcript:", transcript)


def process_audio(queue: Queue):
    asyncio.run(process_audio_async(queue))