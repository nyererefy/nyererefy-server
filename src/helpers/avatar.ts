import {Storage} from "@google-cloud/storage";
import path from "path";
import config from "config";
import axios from "axios";
import {generateImageName} from "./uuid";

const gc = new Storage({
    keyFilename: path.join(__dirname, '../../credentials/nyererefy-cffdd220b757.json'),
    projectId: 'nyererefy'
});

const bucket = gc.bucket(config.get('bucket'));


export async function uploadImage(image: any) {
    const filename = generateImageName();
    const {createReadStream, mimetype} = await image;

    await new Promise(res =>
        createReadStream()
            .pipe(
                bucket.file(filename).createWriteStream({
                    contentType: mimetype,
                    resumable: false,
                    gzip: true
                })
            )
            .on("finish", res)
    );

    return filename;
}

export async function deleteObject(filename: string) {
    return await bucket.file(filename).delete();
}

export function getImageUrl(filename?: string): string | null {
    if (filename) return `https://storage.googleapis.com/${config.get('bucket')}/${filename}`;
    return null
}

/**
 * @param url
 */
export function uploadImageFromUrl(url: string): Promise<string> {
    return new Promise(((resolve, reject) => {
        axios
            .get(url, {responseType: 'stream'})
            .then(res => {
                const filename = generateImageName();

                res.data.pipe(
                    bucket.file(filename).createWriteStream({
                        contentType: res.headers['content-type'],
                        resumable: false,
                        gzip: true
                    })
                );
                resolve(filename)
            })
            .catch(e => reject(e));
    }));
}