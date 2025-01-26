import uploadFile from "./uploadFile";
import removeFile from "./removeFile";
import editDoc from "./editDoc";

// There is no firebase function to edit a file. Instead the solution is to: 
//  1. delete file
//  2. upload new file
//  3. update doc with new file reference

interface IEditFile {
    id: string;
    file: File;
    title: string;
    description: string;
    price: number;
    tags: string[];
    url: string;
    series?: string;
    seriesOrder?: number;  
    onProgress?: (progress: number) => void;
    stripePriceId: string;
    stripeProductId: string;
}

export default async function editFile({ url, id, title, description, price, tags, file, onProgress, series, seriesOrder, stripePriceId, stripeProductId }: IEditFile): Promise<string> {

    try {

        // delete file
        const deleteFile = await removeFile({ url });
        if (!deleteFile) {
            throw new Error("Issue: No original file found to delete");
        }

        // upload new file
        const imageUrl = await uploadFile({ reference: title.replace(' ', '_'), file, onProgress });
        if (!imageUrl) {
            throw new Error("Issue uploading new file");
        }

        // update doc with new file url
        try {
            await editDoc({ id, title, description, price, tags, imageUrl, series, seriesOrder, stripePriceId, stripeProductId });
        } catch (error) {
            throw new Error("Issue updating document: " + error);
        }

        return imageUrl;

    } catch (error) {
        throw new Error("Issue editing file: " + error);
    }

}