import React, { useState, useRef, useEffect } from 'react';
import AudioBufferManager from '../utils/AudioBufferManager';

const KeywordDetector: React.FC = () => {
    const [initialized, setInitialized] = useState<boolean>(false);
    const [keywords, setKeywords] = useState<string[]>([]);

    const bufferRef = useRef<AudioBufferManager>(AudioBufferManager.getInstance());
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    
    const init = (): void => {
        if (initialized) return;

        // FIXME: Replace with supabase call when set up.
        keywords.push("initiative");
        keywords.push("roll");
        keywords.push("monster");

        setInitialized(true);
    }

    const processAudioData = (): void => {
        if (!bufferRef.current) return;

        const audioData: Float32Array = bufferRef.current.getRetrievalBuffer();
        if (audioData.length === 0) return;

        // Dictation here

        // Check for Keywords

        // Send resource request with audio to n8n
    }

    useEffect(() => {
        if (!initialized) init();
    })

    return (
        <></>
    );
}