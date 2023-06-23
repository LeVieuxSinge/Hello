export interface CrunkerConstructorOptions {
    /**
     * Sample rate for Crunker's internal audio context.
     *
     * @default 44100
     */
    sampleRate: number;
}

export type CrunkerInputTypes = string | File | Blob;

/**
 * An exported Crunker audio object.
 */
export interface ExportedCrunkerAudio {
    blob: Blob;
    url: string;
    element: HTMLAudioElement;
}

/**
 * Crunker is the simple way to merge, concatenate, play, export and download audio files using the Web Audio API.
 */
export class Crunker {
    private readonly _sampleRate: number;
    private readonly _context: AudioContext;

    /**
     * Creates a new instance of Crunker with the provided options.
     *
     * If `sampleRate` is not defined, it will auto-select an appropriate sample rate
     * for the device being used.
     */
    constructor({ sampleRate }: Partial<CrunkerConstructorOptions> = {}) {
        this._context = this._createContext();

        sampleRate ||= this._context.sampleRate;

        this._sampleRate = sampleRate;
    }

    /**
     * Creates Crunker's internal AudioContext.
     *
     * @internal
     */
    private _createContext(): AudioContext {
        return new AudioContext();
    }

    /**
     *
     * The internal AudioContext used by Crunker.
     */
    get context(): AudioContext {
        return this._context;
    }

    /**
     * Asynchronously fetches multiple audio files and returns an array of AudioBuffers.
     */
    async fetchAudio(...filepaths: CrunkerInputTypes[]): Promise<AudioBuffer[]> {
        return await Promise.all(
            filepaths.map(async (filepath) => {
                let buffer: ArrayBuffer;

                if (filepath instanceof File || filepath instanceof Blob) {
                    buffer = await filepath.arrayBuffer();
                }
                else {
                    buffer = await fetch(filepath).then((response) => {
                        if (response.headers.has("Content-Type") && !response.headers.get("Content-Type")!.includes("audio/")) {
                            console.warn(
                                `Crunker: Attempted to fetch an audio file, but its MIME type is \`${response.headers.get("Content-Type")!.split(";")[0]
                                }\`. We'll try and continue anyway. (file: "${filepath}")`
                            );
                        }

                        return response.arrayBuffer();
                    });
                }

                return await this._context.decodeAudioData(buffer);
            })
        );
    }

    /**
     * Merges (layers) multiple AudioBuffers into a single AudioBuffer.
     *
     * **Visual representation:**
     *
     * ![](https://user-images.githubusercontent.com/12958674/88806278-968f0680-d186-11ea-9cb5-8ef2606ffcc7.png)
     */
    mergeAudio(buffers: AudioBuffer[]): AudioBuffer {
        const output = this._context.createBuffer(
            this._maxNumberOfChannels(buffers),
            this._sampleRate * this._maxDuration(buffers),
            this._sampleRate
        );

        buffers.forEach((buffer) => {
            for (let channelNumber = 0; channelNumber < buffer.numberOfChannels; channelNumber++) {
                const outputData = output.getChannelData(channelNumber);
                const bufferData = buffer.getChannelData(channelNumber);

                for (let i = buffer.getChannelData(channelNumber).length - 1; i >= 0; i--) {
                    outputData[i] += bufferData[i];
                }

                output.getChannelData(channelNumber).set(outputData);
            }
        });

        return output;
    }

    /**
     * Concatenates multiple AudioBuffers into a single AudioBuffer.
     *
     * **Visual representation:**
     *
     * ![](https://user-images.githubusercontent.com/12958674/88806297-9d1d7e00-d186-11ea-8cd2-c64cb0324845.png)
     */
    concatAudio(buffers: AudioBuffer[]): AudioBuffer {
        const output = this._context.createBuffer(
            this._maxNumberOfChannels(buffers),
            this._totalLength(buffers),
            this._sampleRate
        );
        let offset = 0;

        buffers.forEach((buffer) => {
            for (let channelNumber = 0; channelNumber < buffer.numberOfChannels; channelNumber++) {
                output.getChannelData(channelNumber).set(buffer.getChannelData(channelNumber), offset);
            }

            offset += buffer.length;
        });

        return output;
    }

    /**
     * Pads a specified AudioBuffer with silence from a specified start time,
     * for a specified length of time.
     *
     * Accepts float values as well as whole integers.
     *
     * @param buffer AudioBuffer to pad
     * @param padStart Time to start padding (in seconds)
     * @param seconds Duration to pad for (in seconds)
     */
    padAudio(buffer: AudioBuffer, padStart: number = 0, seconds: number = 0): AudioBuffer {
        if (seconds === 0) {
            return buffer;
        }

        if (padStart < 0) {
            throw new Error("Crunker: Parameter \"padStart\" in padAudio must be positive");
        }
        if (seconds < 0) {
            throw new Error("Crunker: Parameter \"seconds\" in padAudio must be positive");
        }

        const updatedBuffer = this._context.createBuffer(
            buffer.numberOfChannels,
            Math.ceil(buffer.length + seconds * buffer.sampleRate),
            buffer.sampleRate
        );

        for (let channelNumber = 0; channelNumber < buffer.numberOfChannels; channelNumber++) {
            const channelData = buffer.getChannelData(channelNumber);
            updatedBuffer
                .getChannelData(channelNumber)
                .set(channelData.subarray(0, Math.ceil(padStart * buffer.sampleRate) + 1), 0);

            updatedBuffer
                .getChannelData(channelNumber)
                .set(
                    channelData.subarray(Math.ceil(padStart * buffer.sampleRate) + 2, updatedBuffer.length + 1),
                    Math.ceil((padStart + seconds) * buffer.sampleRate)
                );
        }

        return updatedBuffer;
    }

    /**
     * Plays the provided AudioBuffer in an AudioBufferSourceNode.
     */
    play(buffer: AudioBuffer): AudioBufferSourceNode {
        const source = this._context.createBufferSource();

        source.buffer = buffer;
        source.connect(this._context.destination);
        source.start();

        return source;
    }

    /**
     * Exports the specified AudioBuffer to a Blob, Object URI and HTMLAudioElement.
     *
     * Note that changing the MIME type does not change the actual file format. The
     * file format will **always** be a WAVE file due to how audio is stored in the
     * browser.
     *
     * @param buffer Buffer to export
     * @param type MIME type (default: `audio/wav`)
     */
    export(buffer: AudioBuffer, type: string = "audio/wav"): ExportedCrunkerAudio {
        const recorded = this._interleave(buffer);
        const dataview = this._writeHeaders(recorded, buffer.numberOfChannels, buffer.sampleRate);
        const audioBlob = new Blob([dataview], { type });

        return {
            blob: audioBlob,
            url: this._renderURL(audioBlob),
            element: this._renderAudioElement(audioBlob),
        };
    }

    /**
     * Downloads the provided Blob.
     *
     * @param blob Blob to download
     * @param filename An optional file name to use for the download (default: `crunker`)
     */
    download(blob: Blob, filename: string = "crunker"): HTMLAnchorElement {
        const a = document.createElement("a");

        a.style.display = "none";
        a.href = this._renderURL(blob);
        a.download = `${filename}.${blob.type.split("/")[1]}`;
        a.click();

        return a;
    }

    /**
     * Executes a callback if the browser does not support the Web Audio API.
     *
     * Returns the result of the callback, or `undefined` if the Web Audio API is supported.
     *
     * @param callback callback to run if the browser does not support the Web Audio API
     */
    notSupported<T>(callback: () => T): T | undefined {
        return this._isSupported() ? undefined : callback();
    }

    /**
     * Closes Crunker's internal AudioContext.
     */
    close(): this {
        this._context.close();
        return this;
    }

    /**
     * Returns the largest duration of the longest AudioBuffer.
     *
     * @internal
     */
    private _maxDuration(buffers: AudioBuffer[]): number {
        return Math.max(...buffers.map((buffer) => buffer.duration));
    }

    /**
     * Returns the largest number of channels in an array of AudioBuffers.
     *
     * @internal
     */
    private _maxNumberOfChannels(buffers: AudioBuffer[]): number {
        return Math.max(...buffers.map((buffer) => buffer.numberOfChannels));
    }

    /**
     * Returns the sum of the lengths of an array of AudioBuffers.
     *
     * @internal
     */
    private _totalLength(buffers: AudioBuffer[]): number {
        return buffers.map((buffer) => buffer.length).reduce((a, b) => a + b, 0);
    }

    /**
     * Returns whether the browser supports the Web Audio API.
     *
     * @internal
     */
    private _isSupported(): boolean {
        return "AudioContext" in window || "webkitAudioContext" in window || "mozAudioContext" in window;
    }

    /**
     * Writes the WAV headers for the specified Float32Array.
     *
     * Returns a DataView containing the WAV headers and file content.
     *
     * @internal
     */
    private _writeHeaders(buffer: Float32Array, numOfChannels: number, sampleRate: number): DataView {
        const bitDepth = 16;
        const bytesPerSample = bitDepth / 8;
        const sampleSize = numOfChannels * bytesPerSample;

        const fileHeaderSize = 8;
        const chunkHeaderSize = 36;
        const chunkDataSize = buffer.length * bytesPerSample;
        const chunkTotalSize = chunkHeaderSize + chunkDataSize;

        const arrayBuffer = new ArrayBuffer(fileHeaderSize + chunkTotalSize);
        const view = new DataView(arrayBuffer);

        this._writeString(view, 0, "RIFF");
        view.setUint32(4, chunkTotalSize, true);
        this._writeString(view, 8, "WAVE");
        this._writeString(view, 12, "fmt ");
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numOfChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * sampleSize, true);
        view.setUint16(32, sampleSize, true);
        view.setUint16(34, bitDepth, true);
        this._writeString(view, 36, "data");
        view.setUint32(40, chunkDataSize, true);

        return this._floatTo16BitPCM(view, buffer, fileHeaderSize + chunkHeaderSize);
    }

    /**
     * Converts a Float32Array to 16-bit PCM.
     *
     * @internal
     */
    private _floatTo16BitPCM(dataview: DataView, buffer: Float32Array, offset: number): DataView {
        for (let i = 0; i < buffer.length; i++, offset += 2) {
            const tmp = Math.max(-1, Math.min(1, buffer[i]));
            dataview.setInt16(offset, tmp < 0 ? tmp * 0x8000 : tmp * 0x7FFF, true);
        }

        return dataview;
    }

    /**
     * Writes a string to a DataView at the specified offset.
     *
     * @internal
     */
    private _writeString(dataview: DataView, offset: number, header: string): void {
        for (let i = 0; i < header.length; i++) {
            dataview.setUint8(offset + i, header.charCodeAt(i));
        }
    }

    /**
     * Converts an AudioBuffer to a Float32Array.
     *
     * @internal
     */
    private _interleave(input: AudioBuffer): Float32Array {
        const channels = Array.from({ length: input.numberOfChannels }, (_, i) => i);
        const length = channels.reduce((prev, channelIdx) => prev + input.getChannelData(channelIdx).length, 0);
        const result = new Float32Array(length);

        let index = 0;
        let inputIndex = 0;

        // For 2 channels its like: [L[0], R[0], L[1], R[1], ... , L[n], R[n]]
        while (index < length) {
            channels.forEach((channelIdx) => {
                result[index++] = input.getChannelData(channelIdx)[inputIndex];
            });

            inputIndex++;
        }

        return result;
    }

    /**
     * Creates an HTMLAudioElement whose source is the specified Blob.
     *
     * @internal
     */
    private _renderAudioElement(blob: Blob): HTMLAudioElement {
        const audio = document.createElement("audio");

        audio.controls = true;
        audio.src = this._renderURL(blob);

        return audio;
    }

    /**
     * Creates an Object URL for the specified Blob.
     *
     * @internal
     */
    private _renderURL(blob: Blob): string {
        return (window.URL || window.webkitURL).createObjectURL(blob);
    }
}

export class Pinyin {
    hansIntlSegmenter: Intl.Segmenter = new Intl.Segmenter("zh-Hans-CN", {
        granularity: "word",
    });

    segment(hans: string): string[] {
        if (Intl.Segmenter) {
            console.log(hans);
            console.log(this.hansIntlSegmenter.segment(hans));
            return [...this.hansIntlSegmenter.segment(hans)].map((s) => s.segment);
        }

        return hans.split("");
    }
}

const CONSONANTS = [
    "b",
    "c",
    "ch",
    "d",
    "f",
    "g",
    "h",
    "j",
    "k",
    "l",
    "m",
    "n",
    "p",
    "q",
    "r",
    "s",
    "sh",
    "t",
    "w", // Sort of
    "x",
    "y", // Sort of
    "z",
    "zh",
];

const VOWELS = [
    "a",
    "ai",
    "an",
    "ang",
    "ao",
    "e",
    "ei",
    "en",
    "eng",
    "er",
    "i",
    "ia",
    "ian",
    "iang",
    "iao",
    "ie",
    "in",
    "ing",
    "io", // Weird
    "iou", // Weird
    "iong",
    "iu", // Weird
    "o",
    "ong",
    "ou",
    "u",
    "ua",
    "uai",
    "uan",
    "uang",
    "ue", // Weird
    "uen", // Weird
    "ueng", // Weird
    "ui", // Weird
    "uei", // Weird
    "un",
    "uo",
    "u", // Ü
    "ue", // Üe
    "uan", // Üan
    "un", // Ün
];

const SYLLABLES = [
    "a",
    "ai",
    "an",
    "ang",
    "ao",
    "b",
    "ba",
    "bai",
    "ban",
    "bang",
    "bao",
    "bei",
    "ben",
    "beng",
    "bi",
    "bian",
    "biao",
    "bie",
    "bin",
    "bing",
    "bo",
    "bu",
    "ca",
    "cai",
    "can",
    "cang",
    "cao",
    "ce",
    "cen",
    "ceng",
    "cha",
    "chai",
    "chan",
    "chang",
    "chao",
    "che",
    "chen",
    "cheng",
    "chi",
    "chong",
    "chou",
    "chu",
    "chua",
    "chuai",
    "chuan",
    "chuang",
    "chui",
    "chun",
    "chuo",
    "ci",
    "cong",
    "cou",
    "cu",
    "cuan",
    "cui",
    "cun",
    "cuo",
    "da",
    "dai",
    "dan",
    "dang",
    "dao",
    "de",
    "dei",
    "den",
    "deng",
    "di",
    "dian",
    "diao",
    "die",
    "ding",
    "diu",
    "dong",
    "dou",
    "du",
    "duan",
    "dui",
    "dun",
    "duo",
    "e",
    "ei",
    "en",
    "eng",
    "er",
    "fa",
    "fan",
    "fang",
    "fei",
    "fen",
    "feng",
    "fiao",
    "fo",
    "fou",
    "fu",
    "ga",
    "gai",
    "gan",
    "gang",
    "gao",
    "ge",
    "gei",
    "gen",
    "geng",
    "gong",
    "gou",
    "gu",
    "gua",
    "guai",
    "guan",
    "guang",
    "gui",
    "gun",
    "guo",
    "ha",
    "hai",
    "han",
    "hang",
    "hao",
    "he",
    "hei",
    "hen",
    "heng",
    "hm",
    "hong",
    "hou",
    "hu",
    "hua",
    "huai",
    "huan",
    "huang",
    "hui",
    "hun",
    "huo",
    "i",
    "ia",
    "ian",
    "iang",
    "iao",
    "ie",
    "in",
    "ing",
    "io",
    "iong",
    "iu",
    "ji",
    "jia",
    "jian",
    "jiang",
    "jiao",
    "jie",
    "jin",
    "jing",
    "jiong",
    "jiu",
    "ju",
    "juan",
    "jue",
    "jun",
    "ka",
    "kai",
    "kan",
    "kang",
    "kao",
    "ke",
    "ken",
    "keng",
    "kong",
    "kou",
    "ku",
    "kua",
    "kuai",
    "kuan",
    "kuang",
    "kui",
    "kun",
    "kuo",
    "la",
    "lai",
    "lan",
    "lang",
    "lao",
    "le",
    "lei",
    "leng",
    "li",
    "lia",
    "lian",
    "liang",
    "liao",
    "lie",
    "lin",
    "ling",
    "liu",
    "lo",
    "long",
    "lou",
    "lu",
    "luan",
    "lun",
    "luo",
    "lv",
    "lve",
    "m",
    "ma",
    "mai",
    "man",
    "mang",
    "mao",
    "me",
    "mei",
    "men",
    "meng",
    "mi",
    "mian",
    "miao",
    "mie",
    "min",
    "ming",
    "miu",
    "mo",
    "mou",
    "mu",
    "n",
    "na",
    "nai",
    "nan",
    "nang",
    "nao",
    "ne",
    "nei",
    "nen",
    "neng",
    "ni",
    "nian",
    "niang",
    "niao",
    "nie",
    "nin",
    "ning",
    "niu",
    "nong",
    "nou",
    "nu",
    "nuan",
    "nun",
    "nuo",
    "nv",
    "nve",
    "o",
    "ong",
    "ou",
    "pa",
    "pai",
    "pan",
    "pang",
    "pao",
    "pei",
    "pen",
    "peng",
    "pi",
    "pian",
    "piao",
    "pie",
    "pin",
    "ping",
    "po",
    "pou",
    "pu",
    "qi",
    "qia",
    "qian",
    "qiang",
    "qiao",
    "qie",
    "qin",
    "qing",
    "qiong",
    "qiu",
    "qu",
    "quan",
    "que",
    "qun",
    "ran",
    "rang",
    "rao",
    "re",
    "ren",
    "reng",
    "ri",
    "rong",
    "rou",
    "ru",
    "rua",
    "ruan",
    "rui",
    "run",
    "ruo",
    "sa",
    "sai",
    "san",
    "sang",
    "sao",
    "se",
    "sen",
    "seng",
    "sha",
    "shai",
    "shan",
    "shang",
    "shao",
    "she",
    "shei",
    "shen",
    "sheng",
    "shi",
    "shou",
    "shu",
    "shua",
    "shuai",
    "shuan",
    "shuang",
    "shui",
    "shun",
    "shuo",
    "si",
    "song",
    "sou",
    "su",
    "suan",
    "sui",
    "sun",
    "suo",
    "ta",
    "tai",
    "tan",
    "tang",
    "tao",
    "te",
    "teng",
    "ti",
    "tian",
    "tiao",
    "tie",
    "ting",
    "tong",
    "tou",
    "tu",
    "tuan",
    "tui",
    "tun",
    "tuo",
    "u",
    "ua",
    "uai",
    "uan",
    "uang",
    "ui",
    "un",
    "uo",
    "v",
    "ve",
    "van",
    "vn",
    "wa",
    "wai",
    "wan",
    "wang",
    "wei",
    "wen",
    "weng",
    "wo",
    "wu",
    "xi",
    "xia",
    "xian",
    "xiang",
    "xiao",
    "xie",
    "xin",
    "xing",
    "xiong",
    "xiu",
    "xu",
    "xuan",
    "xue",
    "xun",
    "ya",
    "yan",
    "yang",
    "yao",
    "ye",
    "yin",
    "ying",
    "yong",
    "you",
    "yu",
    "yuan",
    "yue",
    "yun",
    "za",
    "zai",
    "zan",
    "zang",
    "zao",
    "ze",
    "zei",
    "zen",
    "zeng",
    "zha",
    "zhai",
    "zhan",
    "zhang",
    "zhao",
    "zhe",
    "zhen",
    "zheng",
    "zhi",
    "zhong",
    "zhou",
    "zhu",
    "zhua",
    "zhuai",
    "zhuan",
    "zhuang",
    "zhui",
    "zhun",
    "zhuo",
    "zi",
    "zong",
    "zou",
    "zu",
    "zuan",
    "zui",
    "zun",
    "zuo",
];

const TONE_1 = /.*(ā|ē|ī|ō|ū|ǖ)/;
const TONE_2 = /.*(á|é|í|ó|ú|ǘ)/;
const TONE_3 = /.*(ǎ|ě|ǐ|ǒ|ǔ|ǚ)/;
const TONE_4 = /.*(à|è|ì|ò|ù|ǜ)/;

function iterateSyllable(flatWord: string) {
    console.log("flatWord :", flatWord);
    const syllables = [];

    let letters = "";
    for (let i = 0; i < flatWord.length; i++) {
        const letter = flatWord[i];
        console.log("letter :", letter);
        console.log("letters :", letters);
        console.log("count", i);

        // Syllables always start by a consonant followed by a vowel
        // Check if letters is a consonant
        if (CONSONANTS.includes(letter)) {
            console.log("consonant");
            // Mark accumulated letters as a syllable
            if (i > 0 && letters !== "" && SYLLABLES.includes(letters)) {
                syllables.push(letters);
                letters = "";
            }
        }
        // Check if letters is a vowel
        else if (VOWELS.includes(letter)) {
            console.log("vowel");
        }
        letters += letter;

        // Last letter
        if (i === flatWord.length - 1) {
            console.log("last letter", letters);
            // Mark accumulated letters as a syllable
            if (SYLLABLES.includes(letters)) {
                syllables.push(letters);
            }
        }
    }

    return syllables;
}

export class Yan {
    crunker: Crunker = new Crunker();

    private convert(pinyin: string): string[] {
        return pinyin.split(" ").map((syllable) => {
            if (SYLLABLES.includes(syllable)) {
                if (TONE_1.test(syllable)) {
                    return syllable + "1";
                }
                else if (TONE_2.test(syllable)) {
                    return syllable + "2";
                }
                else if (TONE_3.test(syllable)) {
                    return syllable + "3";
                }
                else if (TONE_4.test(syllable)) {
                    return syllable + "4";
                }
                else {
                    return syllable;
                }
            }

            return "";
        });
    }

    private concatAudioMp3(fileArr: string[]): Promise<AudioBuffer> {
        return new Promise((resolve, _reject) => {
            this.crunker.fetchAudio(...fileArr).then((buffers) => {
                resolve(this.crunker.concatAudio(buffers));
            });
        });
    }

    synthesis(pinyin: string, path: string = "pinyin-syllables/female"): void {
        console.log("pinyin :", pinyin);

        // Separate sentence into words
        const words = pinyin.split(" ");
        console.log("words :", words);

        // Separate pinyin into syllables
        const tones = [];
        for (const word of words) {
            // Create flat version (no tone) of pinyin
            let flat = word.replace(/(ā|á|ǎ|à)/gi, "a");
            console.log("replaced a :", flat);
            flat = flat.replace(/(ē|é|ě|è)/gi, "e");
            console.log("replaced e :", flat);
            flat = flat.replace(/(ī|í|ǐ|ì)/gi, "i");
            console.log("replaced i :", flat);
            flat = flat.replace(/(ō|ó|ǒ|ò)/gi, "o");
            console.log("replaced o :", flat);
            flat = flat.replace(/(ū|ú|ǔ|ù)/gi, "v");
            console.log("replaced u :", flat);
            flat = flat.replace(/(ǖ|ǘ|ǚ|ǜ)/gi, "u");
            console.log("replaced u :", flat);
            console.log("flat :", flat);

            // Detect syllables
            const syllables = iterateSyllable(flat);

            console.log("syllables :", syllables);

            // Replace tone with number
            let letterCount = 0;
            for (const syllable of syllables) {
                let tone = "";
                for (const letter of syllable) {
                    const originalLetter = word[letterCount];
                    console.log("originalLetter :", originalLetter);
                    console.log("letter :", letter);
                    if (CONSONANTS.includes(letter)) {
                        letterCount++;
                        continue;
                    }

                    if (TONE_1.test(originalLetter)) {
                        console.log("tone 1", letter, originalLetter);
                        tone = "1";
                    }
                    else if (TONE_2.test(originalLetter)) {
                        console.log("tone 2", letter, originalLetter);
                        tone = "2";
                    }
                    else if (TONE_3.test(originalLetter)) {
                        console.log("tone 3", letter, originalLetter);
                        tone = "3";
                    }
                    else if (TONE_4.test(originalLetter)) {
                        console.log("tone 4", letter, originalLetter);
                        tone = "4";
                    }

                    letterCount++;
                }
                tones.push(syllable + tone);
            }

            console.log("tones :", tones);
        }

        // Const pyArr = this.convert(pinyin);
        // console.log(pyArr);
        const dirPath = tones.map((elem) => {
            return `./${path}/${elem}.mp3`;
            // If (elem[0]?.trim()) {
            //     return `./${path}/${elem[0]}.mp3`;
            // }
            // return `./${path}/1000.mp3`;
        });

        console.log(dirPath);
        this.concatAudioMp3(dirPath).then((buffer) => {
            this.crunker.play(buffer);
        });
    }
}

export default defineNuxtPlugin((_nuxtApp) => {
    return {
        provide: {
            yan: new Yan()
        }
    };
});
