import { deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export async function removeDoc({ id }: { id: string }): Promise<boolean> {
    try {
        await deleteDoc(doc (db, "photos", id))
        return true;
    } catch (error) {
        console.log("Error deleting document: ", error);
        return false
    }
}