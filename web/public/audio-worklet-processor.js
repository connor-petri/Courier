// This file is part of the Web Audio API implementation for audio processing.
class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input && input.length > 0) {
            const channelData = input[0]

            // Send the PCM data to the main thread
            this.port.postMessage(channelData);
        }
        return true; // Keep the processor alive
    }
}

registerProcessor('audio-processor', AudioProcessor);