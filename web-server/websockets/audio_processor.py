import sys
import wave
from datetime import datetime
import asyncio
from multiprocessing import Queue
import speech_recognition as sr

def process_audio(queue: Queue, sample_rate: int, sample_width: int, channels: int):
    recognizer = sr.Recognizer()
    transcript = ""
    buffer = b""

    audio_file = wave.open(f"./audio/{datetime.now().strftime('%Y%m%d_%H%M%S')}.wav", 'wb')
    audio_file.setnchannels(channels) # Mono
    audio_file.setsampwidth(sample_width) # 16-bit
    audio_file.setframerate(sample_rate)

    while True:
        audio_data = queue.get()

        if audio_data == "STOP":
            break

        buffer += audio_data

        audio_file.writeframes(audio_data)

        if len(buffer) >= sample_rate * sample_width * channels * 3:
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