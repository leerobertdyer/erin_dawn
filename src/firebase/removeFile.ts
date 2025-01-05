import { ref, deleteObject } from "firebase/storage";
import { storage } from "./firebaseConfig";

export default async function removeFile({ url }: { url: string }): Promise<boolean> {

    const file = ref(storage, url);

    deleteObject(file).then(async () => {
        console.log('File deleted successfully')
    }).catch((error) => {
        console.log("Error deleting file: ", error)
        return false;
    });
    return true;
}