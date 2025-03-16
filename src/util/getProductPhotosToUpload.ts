import uploadFile from "../firebase/uploadFile";
import { IGeneralPhoto } from "../Interfaces/IPhotos";
import { NEW_PRODUCT_IMAGE_QUALITY } from "./constants";
import { resizeFile } from "./resizeFile";

export default async function getProductPhotosToUpload(files: File[], title: string, tags: string[], maxWidth: number, maxHeight: number, onProgress: (progress: number) => void) {

    const filesToUpload: IGeneralPhoto[] = await Promise.all(files.map(async (file, index) => {
        // Create a unique name for each file using index and a unique timestamp
        const safeName = `${title.replace(/ /g, "_")}_${index}_${Date.now() + index}`;
        
        // resize incoming photo
        const resizedFile = await resizeFile(file, {
            maxWidth,
            maxHeight,
            maintainAspectRatio: true,
            quality: NEW_PRODUCT_IMAGE_QUALITY  // Good balance between quality and file size
        });
        const fileToUpload = {
            reference: safeName,
            file: resizedFile,
            onProgress: onProgress ?? null,
        }
        const downloadUrl = await uploadFile(fileToUpload)
        if (!downloadUrl) throw new Error("Error uploading new category photo")
        const randomId = crypto.randomUUID()
        return { url: downloadUrl, id: randomId, order: index + 1, title, tags }
     }))

     return filesToUpload

}
