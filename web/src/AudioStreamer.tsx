import React, { useState, useRef } from 'react';

type AudioStreamerOptions = {
    webSocketAddress: URL;
    chunkRateMs: number;
};

const AudioStreamer: React.FC<AudioStreamerOptions> = ({ webSocketAddress = new URL("ws://localhost:8000/ws/audio_stream/"), chunkRateMs = 250 }: AudioStreamerOptions) => {
    const [isStreaming, setIsStreaming] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const startStreaming = async () => {
        try {
            // Get permission to use the microphone
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Create WebSocket connection
            const socket = new WebSocket(webSocketAddress);
            socketRef.current = socket;

            // Send recording metadata to the server
            socket.onopen = () => {
                const metadata = {
                    sample_rate: 44100,
                    sample_width: 2,
                    channels: 1,
                }
                socket.send(JSON.stringify(metadata));
            };

            // Create AudioContext
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;

            // Add an AudioWorkletProcessor
            await audioContext.audioWorklet.addModule('/static/audio-worklet-processor.js');

            const source = audioContext.createMediaStreamSource(stream);
            const workletNode = new AudioWorkletNode(audioContext, 'audio-processor');

            workletNode.port.onmessage = (event) => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(event.data); // Send raw PCM data
                }
            };

            source.connect(workletNode);
            workletNode.connect(audioContext.destination);

            setIsStreaming(true);
        } catch (err) {
            console.error('Failed to start streaming:', err);
        }
    };

    const stopStreaming = () => {
        // Close WebSocket
        socketRef.current?.close();

        // Close AudioContext
        audioContextRef.current?.close();

        setIsStreaming(false);
    };

    return (
        <div>
            <button onClick={isStreaming ? stopStreaming : startStreaming}>
                {isStreaming ? 'Stop Streaming' : 'Start Streaming'}
            </button>
            <p>{socketRef?.current?.readyState === WebSocket.OPEN ? 'Connected' : 'Not Connected'}</p>
        </div>
    );
};

export default AudioStreamer;