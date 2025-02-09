import uploadFile from "./uploadFile";
import { removeFile } from "./removeFile";
import { editDoc } from "./editDoc";

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
    size: string;
    tags: string[];
    url: string;
    category?: string;
    series?: string;
    itemOrder?: number;  
    itemName?: string;
    onProgress?: (progress: number) => void;
    stripePriceId: string;
    stripeProductId: string;
}

export default async function editFile({ url, id, title, description, price, tags, file, onProgress, series, category, itemOrder, itemName, stripePriceId, stripeProductId, size }: IEditFile): Promise<string> {

    try {
        // delete file
        const deleteFile = await removeFile({ url });
        if (!deleteFile) {
            throw new Error("Issue: No original file found to delete");
        }

        // upload new file
        const imageUrl = await uploadFile({ reference: title.replace(/ /g, '_'), file, onProgress });
        if (!imageUrl) {
            throw new Error("Issue uploading new file");
        }
        // update doc with new file url
        try {
            await editDoc({ id, title, description, price, tags, imageUrl, series, category, itemOrder, itemName, stripePriceId, stripeProductId, size });
        } catch (error) {
            throw new Error("Issue updating document: " + error);
        }

        return imageUrl;

    } catch (error) {
        throw new Error("Issue editing file: " + error);
    }

}