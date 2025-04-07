import React from 'react';
import DictationComponent, {useSpeechRecognition} from 'react-speech-recognition';

function DictationComponent() {
    // hook
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
        startListening, 
        stopListening
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser does not support speech recognition.</span>
    }

    const handleStart = () => {
        SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    }

    return (
        <div>
            <p>Microphone: {listening ? 'on' : 'off'}</p>
            <button onClick={resetTranscript}>Reset</button>
            <button onClick={handleStart}>Start</button>
            <button onClick={SpeechRecognition.stopListening}>Stop</button>
            <p>{transcript}</p>
        </div>
    );
}

export default DictationComponent;