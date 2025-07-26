import React, { useState, useRef, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import AudioBufferManager from '../utils/AudioBufferManager';

interface KeywordDetectorProps {
    onKeywordDetected: any;
}

const KeywordDetector: React.FC<KeywordDetectorProps> = ({ onKeywordDetected }) => {
    const [initialized, setInitialized] = useState<boolean>(false);
    const [keywords, setKeywords] = useState<string[]>([]);
    const [sampleIntervalMs, setSampleIntervalMs] = useState<number>(100);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const { transcript, listening, resetTranscript } = useSpeechRecognition();
    
    const init = (): void => {
        if (initialized) return;

        // FIXME: Replace with supabase call when set up.
        keywords.push("initiative");
        keywords.push("roll");
        keywords.push("monster");

        SpeechRecognition.startListening();

        setInitialized(true);
    }

    const checkTranscript = () => {
        const foundKeyword = keywords.some(keyword => 
            transcript.toLowerCase().includes(keyword.toLowerCase()));

        if (foundKeyword) {
            console.log("Keyword Detected: " + foundKeyword);
            onKeywordDetected();
        }
    }

    useEffect(() => {
        if (!initialized) init();

        // Process Audio every $sampleIntervalMs ms
        intervalRef.current = setInterval(checkTranscript, sampleIntervalMs);

        return () => {
            SpeechRecognition.stopListening();
        };
    }, [intervalRef]);

    return (
        <div>
            <p>Keyword Detector Mounted</p>
        </div>
    );
}


export default KeywordDetector;