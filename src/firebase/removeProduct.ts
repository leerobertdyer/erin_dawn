import { doc, runTransaction } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "./firebaseConfig";

interface IRemoveFileParams {
    url: string; 
    id: string; 
}

export default async function removeProduct({ url, id }: IRemoveFileParams): Promise<boolean> {
    const fileRef = ref(storage, url);

    try {
        // Run a transaction to delete the document
        await runTransaction(db, async (transaction) => {
            const docRef = doc(db, "photos", id);
            transaction.delete(docRef);
        });

        // Delete the file from Firebase Storage
        await deleteObject(fileRef);
        console.log('File and document deleted successfully');
        return true;
    } catch (error) {
        console.error("Error removing file or document: ", error);
        return false;
    }
}