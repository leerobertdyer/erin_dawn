import { ref, deleteObject } from "firebase/storage";
import { storage } from "./firebaseConfig";

// Handles only the file removal for one or more files
async function removeFiles({ urls }: { urls: string | string[] }): Promise<boolean> {
    try {
        // Handle both single string and array of strings
        const urlArray = Array.isArray(urls) ? urls : [urls];
        
        // Use Promise.all to wait for all deletions
        await Promise.all(urlArray.map(async (url) => {
            const file = ref(storage, url);
            await deleteObject(file);
        }));
        
        return true;
    } catch (error) {
        console.error("Error removing files:", error);
        return false;
    }
}


export { removeFiles };