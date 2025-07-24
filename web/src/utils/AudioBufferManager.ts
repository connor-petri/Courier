class AudioBufferManager {
    private static instance: AudioBufferManager;
    private buffer: Float32Array;
    private writePosition: number = 0;
    private readonly bufferSize: number;
    private readonly sampleRate: number;
    private readonly sampleWidth: number;

    private constructor(
        durationSeconds: number = 60,
        sampleRate: number = 44100,
        sampleWidth: number = 2
    ) {
        this.sampleRate = sampleRate;
        this.sampleWidth = sampleWidth;
        this.bufferSize = durationSeconds * sampleRate;
        this.buffer = new Float32Array(this.bufferSize);
    }

    static getInstance (
        durationSeconds: number = 60,
        sampleRate: number = 44100,
        sampleWidth: number = 2
    ): AudioBufferManager {
        if (!AudioBufferManager.instance) {
            AudioBufferManager.instance = new AudioBufferManager(durationSeconds, sampleRate, sampleWidth)
        }
        return AudioBufferManager.instance
    }

    addAudioData(data: Float32Array): void {
        for (let i = 0; i < data.length; i++) {
            this.buffer[this.writePosition] = data[i];
            this.writePosition = (this.writePosition + 1) % this.bufferSize;
        }
    }

    getAudio(): Float32Array {
        const result = new Float32Array(this.bufferSize)

        for (let i = 0; i < this.bufferSize; i++) {
            result[i] = this.buffer[(this.writePosition + i) % this.bufferSize];
        }

        return result;
    }

    getRawBuffer(): Float32Array {
        return this.buffer;
    }
}

export default AudioBufferManager;