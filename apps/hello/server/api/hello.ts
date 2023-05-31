import fs from "fs";
import util from "util";
import { TextToSpeechClient, protos } from "@google-cloud/text-to-speech";

export default defineEventHandler(async (event) => {
    const client = new TextToSpeechClient({
        projectId: "gentle-exchange-388401",
    });
    console.log(client);

    // The text to synthesize
    // const text = "hello, world!";
    const text = "中国";

    // Construct the request
    const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
        input: { text },
        // Select the language and SSML voice gender (optional)
        voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
        // Select the type of audio encoding
        audioConfig: { audioEncoding: "MP3" },
    };

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    const content = response.audioContent;
    if (content) {
        await writeFile("output.mp3", content, "binary");
    }
    console.log("Audio content written to file: output.mp3");

    return {
        hello: "world"
    };
});
