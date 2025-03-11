import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebaseConfig";

export async function removePhotoDoc({ id }: { id: string }): Promise<boolean> {
    try {
        await deleteDoc(doc (db, "photos", id))
        return true;
    } catch (error) {
        console.log("Error deleting document: ", error);
        return false
    }
}

export async function removeProductDoc({ id }: { id: string }): Promise<boolean> {
    try {
        await deleteDoc(doc (db, "product", id))
        return true;
    } catch (error) {
        console.log("Error deleting document: ", error);
        return false
    }
}

export async function removeSeriesDoc({ itemName }: { itemName: string }): Promise<boolean> {
    try {
        // Get all the documents that have the same itemName
          const items = collection(db, "photos");
            const q = query(items, where("itemName", "==", itemName));
            const querySnapshot = await getDocs(q);
        
            if (querySnapshot.empty) {
                console.log("No categories found");
                return false;
            }
        
            const doc = querySnapshot.docs[0];
            const data = doc.data();
            console.log(data.categories)

         
        return true;
    } catch (error) {
        console.log("Error deleting document: ", error);
        return false
    }
}