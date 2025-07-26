import React, { useState, useRef, useEffect } from 'react';
import AudioBufferManager from '../utils/AudioBufferManager';
import { supabase } from '../supabase-client';

interface AudioRecorderProps {
    durationSeconds: number;
    sampleWidth: number;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
    durationSeconds = 60,
    sampleWidth = 2
}) => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [sampleRate, setSampleRate] = useState<number>(44100);

    // Initialize buffer after we know the actual sample rate
    const bufferRef = useRef<AudioBufferManager | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const workletNodeRef = useRef<AudioWorkletNode | null>(null);
    const playbackSourceRef = useRef<AudioBufferSourceNode | null>(null);

    const initializeAudio = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                }
            });

            mediaStreamRef.current = stream;

            // Create AudioContext without forcing sample rate
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;

            // Get the actual sample rate and update our state
            const finalSampleRate = audioContext.sampleRate;
            setSampleRate(finalSampleRate);

            // Now initialize buffer with the correct sample rate
            bufferRef.current = AudioBufferManager.getInstance(
                durationSeconds, 
                finalSampleRate, 
                sampleWidth
            );

            console.log('AudioContext sample rate:', finalSampleRate);

            await audioContext.audioWorklet.addModule('/audio-worklet-processor.js');
            setIsInitialized(true);
            return true;
        } catch (error) {
            console.error("Failed to initialize audio: ", error);
            return false;
        }
    };

    const startRecording = async () => {
        if (!isInitialized) {
            const initialized = await initializeAudio();
            if (!initialized) return;
        }

        if (!audioContextRef.current || !mediaStreamRef.current || !bufferRef.current) return;

        try {
            const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
            const workletNode = new AudioWorkletNode(audioContextRef.current, 'audio-processor');
            workletNodeRef.current = workletNode;

            workletNode.port.onmessage = (event) => {
                const audioData = event.data as Float32Array;
                bufferRef.current?.addAudioData(audioData);
            };

            source.connect(workletNode);
            setIsRecording(true);
        } catch (error) {
            console.error("Failed to start recording: " + error);
        }
    }

    const stopRecording = () => {
        if (workletNodeRef.current) {
            workletNodeRef.current.disconnect();
            workletNodeRef.current = null;
        }
        setIsRecording(false);
    }

    const startPlayback = async () => {
        if (!bufferRef.current || !audioContextRef.current) {
            console.error("No audio data to play");
            return;
        }

        try {
            // Stop any existing playback
            stopPlayback();

            // Get the recorded audio data
            const audioData = bufferRef.current.getAudio();
            
            if (audioData.length === 0) {
                console.error("No audio data recorded yet");
                return;
            }

            // Create an AudioBuffer
            const audioBuffer = audioContextRef.current.createBuffer(
                1, // mono
                audioData.length,
                sampleRate
            );

            // Copy our Float32Array data to the AudioBuffer
            const channelData = audioBuffer.getChannelData(0);
            channelData.set(audioData);

            // Create a buffer source node
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            
            // Connect to speakers
            source.connect(audioContextRef.current.destination);
            
            // Set up event listeners
            source.onended = () => {
                setIsPlaying(false);
                playbackSourceRef.current = null;
            };

            // Store reference and start playback
            playbackSourceRef.current = source;
            source.start();
            setIsPlaying(true);

        } catch (error) {
            console.error("Failed to start playback: ", error);
            setIsPlaying(false);
        }
    };

    const stopPlayback = () => {
        if (playbackSourceRef.current) {
            try {
                playbackSourceRef.current.stop();
            } catch (error) {
                // Source might already be stopped
                console.log("Playback already stopped");
            }
            playbackSourceRef.current = null;
        }
        setIsPlaying(false);
    };

    const cleanup = () => {
        stopRecording();
        stopPlayback();
        
        // Stop microphone
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        
        // Close audio context
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        
        setIsInitialized(false);
    }

    useEffect(() => {
<<<<<<< Updated upstream
        return () => cleanup();
    }, []);
=======
        return cleanup;
    }, []);
``
    function createWavBuffer(audioData: Float32Array, sampleRate: number): ArrayBuffer {
        const length = audioData.length;
        const buffer = new ArrayBuffer(44 + length * 2);
        const view = new DataView(buffer);
        
        // WAV header
        const writeString = (offset: number, string: string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };
        
        // RIFF chunk descriptor
        writeString(0, 'RIFF');
        view.setUint32(4, 36 + length * 2, true); // File size - 8
        writeString(8, 'WAVE');
        
        // fmt sub-chunk
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
        view.setUint16(20, 1, true); // AudioFormat (PCM = 1)
        view.setUint16(22, 1, true); // NumChannels (mono = 1)
        view.setUint32(24, sampleRate, true); // SampleRate
        view.setUint32(28, sampleRate * 2, true); // ByteRate
        view.setUint16(32, 2, true); // BlockAlign
        view.setUint16(34, 16, true); // BitsPerSample
        
        // data sub-chunk
        writeString(36, 'data');
        view.setUint32(40, length * 2, true); // Subchunk2Size
        
        // Convert float samples to 16-bit PCM
        let offset = 44;
        for (let i = 0; i < length; i++) {
            const sample = Math.max(-1, Math.min(1, audioData[i]));
            view.setInt16(offset, sample * 0x7FFF, true);
            offset += 2;
        }
        
        return buffer;
    }
    
    async function postAudioFile(audioData: Float32Array, url: string, sampleRate: number = 44100): Promise<Response> {
        const wavBuffer = createWavBuffer(audioData, sampleRate);
        const blob = new Blob([wavBuffer], { type: 'audio/wav' });
        
        const formData = new FormData();
        formData.append('audio', blob, 'recording.wav');
        
        return fetch(url, {
            method: 'POST',
            body: formData
        });
    }
>>>>>>> Stashed changes

    return (
        <div>
            <div>
                <button onClick={isRecording ? stopRecording : startRecording}>
                    {isRecording ? "Stop Recording" : "Start Recording"}
                </button>
                <button 
                    onClick={isPlaying ? stopPlayback : startPlayback}
                    disabled={!bufferRef.current}
                >
                    {isPlaying ? "Stop Playback" : "Play Recording"}
                </button>
            </div>
            <p>Sample Rate: {sampleRate} Hz</p>
            <p>Recording: {isRecording ? "Recording" : "Stopped"}</p>
            <p>Playback: {isPlaying ? "Playing" : "Stopped"}</p>
            <button onClick={() => { supabase.auth.signOut() }}>Log Out</button>
<<<<<<< Updated upstream
=======
            
            <button onClick={() => { postAudioFile(
                bufferRef.current?.getAudio()!,
                'https://n8n.lab.printf.org/webhook-test/resource-request',
                sampleRate
            )}}>Post Audio</button>
>>>>>>> Stashed changes
        </div>
    )
}

export default AudioRecorder;