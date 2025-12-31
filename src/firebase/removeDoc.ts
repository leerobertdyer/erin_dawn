import { deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export async function removePhotoDoc({ id }: { id: string }): Promise<boolean> {
    try {
        await deleteDoc(doc (db, "photos", id))
        return true;
    } catch (error) {
        console.error("Error deleting document: ", error);
        return false
    }
}

export async function removeProductDoc({ id }: { id: string }): Promise<boolean> {
    try {
        await deleteDoc(doc (db, "product", id))
        return true;
    } catch (error) {
        console.error("Error deleting document: ", error);
        return false
    }
}