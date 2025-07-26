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
        return () => cleanup();
    }, []);

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
        </div>
    )
}

export default AudioRecorder;