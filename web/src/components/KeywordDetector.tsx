import React, { useState, useRef, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface KeywordDetectorProps {
    onKeywordDetected: () => void;
}

const KeywordDetector: React.FC<KeywordDetectorProps> = ({ onKeywordDetected }) => {
    const [initialized, setInitialized] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [keywords] = useState<string[]>(["initiative", "roll", "monster"]);

    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    
    const startListening = async () => {
        try {
            setError(null);
            await SpeechRecognition.startListening({ continuous: true });
            setInitialized(true);
        } catch (err) {
            setError(`Failed to start speech recognition: ${err}`);
            console.error('Speech recognition error:', err);
        }
    };

    const stopListening = () => {
        SpeechRecognition.stopListening();
        setInitialized(false);
    };

    useEffect(() => {
        if (transcript && keywords.length > 0) {
            const foundKeyword = keywords.find(keyword => 
                transcript.toLowerCase().includes(keyword.toLowerCase())
            );

            if (foundKeyword) {
                console.log("Keyword Detected:", foundKeyword);
                onKeywordDetected();
                resetTranscript(); // Clear transcript after detection
            }
        }
    }, [transcript, keywords, onKeywordDetected, resetTranscript]);

    // Check browser support
    if (!browserSupportsSpeechRecognition) {
        return (
            <div>
                <p style={{ color: 'red' }}>
                    Browser doesn't support speech recognition. Please use Chrome or Safari.
                </p>
            </div>
        );
    }

    return (
        <div>
            <div>
                <button onClick={initialized ? stopListening : startListening}>
                    {initialized ? "Stop Keyword Detection" : "Start Keyword Detection"}
                </button>
            </div>
            <p>Keyword Detector: {listening ? "Listening" : "Not listening"}</p>
            <p>Current transcript: {transcript}</p>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <p>Keywords: {keywords.join(", ")}</p>
        </div>
    );
}

export default KeywordDetector;