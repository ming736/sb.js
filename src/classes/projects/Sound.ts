import BaseMorph from "./BaseMorph";
import * as imaadpcm from "imaadpcm";
function createWavHeader(pcmDataLength: number, sampleRate: number, numChannels: number, bitsPerSample: number) {
    const header = Buffer.alloc(44);
    header.write('RIFF', 0);
    header.writeUInt32LE(36 + pcmDataLength, 4);
    header.write('WAVE', 8);

    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20);
    header.writeUInt16LE(numChannels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(sampleRate * numChannels * bitsPerSample / 8, 28);
    header.writeUInt16LE(numChannels * bitsPerSample / 8, 32);
    header.writeUInt16LE(bitsPerSample, 34);

    header.write('data', 36);
    header.writeUInt32LE(pcmDataLength, 40);

    return header;
}
class NotImplementedError extends Error {
    constructor(...a) {
        super(...a);
        this.name = "NotImplementedError";
    }
}
export default class Sound extends BaseMorph<164> {
    /**
     * The id of this sound.
     */
    id: 164;
    /**
     * The name of this sound.
     */
    name: string;
    readonly isCompressed: boolean;
    readonly sampleRate: number;
    private pcm: Int16Array;
    private adpcm: Uint8Array;
    private sampledSound: Record<any, any>;
    constructor(soundObject: Record<any, any>) {
        if (typeof soundObject !== "object") {
            throw new Error("Invalid sound object")
        }
        super(164, soundObject);
        //this.imageObject = imageObject;
        this.id = 164;
        this.name = soundObject.soundName;
        this.sampledSound = soundObject.sampledSound
        this.isCompressed = soundObject.compressed
        this.sampleRate = this.sampledSound.fields[4]
        this.adpcm = this.isCompressed ? soundObject.compressedData : this.sampledSound.fields[3];
        if (!this.isCompressed) {
            this.pcm = new Int16Array(this.adpcm.buffer);
        }
    }
    /**
     * Returns an `Int16Array` containing PCM data.
     */
    toPCM(): Int16Array {
        if (this.isCompressed) {
            throw new NotImplementedError("Compressed audios do not yet work.")
        }
        if (!this.pcm) {
            if (this.isCompressed) {
                this.pcm = imaadpcm.decode(this.adpcm)
            } else {
                this.pcm = new Int16Array(this.adpcm.buffer)
            }
        }
        return this.pcm
    }
    /**
     * Returns a `Buffer` containing WAV data.
     */
    toWAV(): Buffer {
        if (this.isCompressed) {
            throw new NotImplementedError("Compressed audios do not yet work.")
        }
        let pcm = this.toPCM()
        return Buffer.concat(
            [
                createWavHeader(
                    pcm.length,
                    this.isCompressed ? this.sampleRate : this.sampleRate / 2,
                    1,
                    16
                ),
                Buffer.from(pcm)
            ]
        ) 
    }
}