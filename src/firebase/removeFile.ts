import { ref, deleteObject } from "firebase/storage";
import { storage } from "./firebaseConfig";

 async function removeFile({ url }: { url: string }): Promise<boolean> {

    const file = ref(storage, url);

    deleteObject(file).then(async () => {
        console.log('File deleted successfully')
    }).catch((error) => {
        console.log("Error deleting file: ", error)
        return false;
    });
    return true;
}

async function removeAllFiles({ urls }: { urls: string[] }): Promise<boolean> {
    urls.forEach(async (url) => {
        const file = ref(storage, url);
        deleteObject(file).then(async () => {
            console.log('File deleted successfully')
        }).catch((error) => {
            console.log("Error deleting file: ", error)
            return false;
        });
    });
    return true;
}

export { removeFile, removeAllFiles };