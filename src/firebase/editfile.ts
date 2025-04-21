import uploadFile from "./uploadFile";
import { removeFiles } from "./removeFile";

// There is no firebase function to edit a file. Instead the solution is to: 
//  1. delete file
//  2. upload new file
//  3. update doc with new file reference (This needs to be done separately)

interface IEditFile {
    url: string;
    title: string;
    file: File;
    onProgress?: (progress: number) => void;
}

export default async function editFile({ url, title, file, onProgress }: IEditFile): Promise<string> {

    try {
        // delete file
        const deleteFile = await removeFiles({ urls: url });
        if (!deleteFile) {
            throw new Error("Issue: No original file found to delete");
        }

        // upload new file
        const imageUrl = await uploadFile({ reference: title, file, onProgress });
        if (!imageUrl) {
            throw new Error("Issue uploading new file");
        }

        return imageUrl;

    } catch (error) {
        throw new Error("Issue editing file: " + error);
    }

}