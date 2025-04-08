import React, { useEffect, useRef, useState } from 'react';

type AudioStreamerOptions = {
    webSocketAddress: URL;
    chunkRateMs: number;
}

const AudioStreamer: React.FC = ({ webSocketAddress = new URL("ws://localhost:4000"), chunkRateMs = 250 }: AudioStreamerOptions) => {
    const [isStreaming, setIsStreaming] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    const startStreaming = async () => {
        try {
            // Get permission to use microphone
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Connect Websocket
            const socket = new WebSocket(webSocketAddress);
            socketRef.current = socket;

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            // Stream data through the socket when available
            mediaRecorder.ondataavailable = (event: BlobEvent) => {
                if (event.data.size > 0 && socket.readyState == WebSocket.OPEN) {
                    event.data.arrayBuffer().then((buffer) => {
                        socket.send(buffer);
                    });
                }
            };

            // stream chunks every chunkRateMs ms
            mediaRecorder.start(chunkRateMs);
            setIsStreaming(true);
        } catch (err) {
            console.error('Failed to start Recording', err);
        }
    };

    const stopStreaming = () => {
        mediaRecorderRef.current?.stop();
        setIsStreaming(false);

        socketRef.current?.close();
    }

    return (
        <div>
            <button onClick={isStreaming ? stopStreaming : startStreaming}>
                {isStreaming ? 'Stop Streaming' : 'Start Streaming'}
            </button>
        </div>
    );
};