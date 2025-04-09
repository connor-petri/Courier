class AudioProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input && input[0]) {
            const inputChannel = input[0];
            const int16Array = new Int16Array(inputChannel.length);

            // Convert Float32Array (-1 to 1) to Int16Array (-32768 to 32767)
            for (let i = 0; i < inputChannel.length; i++) {
                int16Array[i] = Math.max(-1, Math.min(1, inputChannel[i])) * 32767;
            }

            // Send the PCM data to the main thread
            this.port.postMessage(int16Array.buffer);
        }
        return true; // Keep the processor alive
    }
}

registerProcessor('audio-processor', AudioProcessor);