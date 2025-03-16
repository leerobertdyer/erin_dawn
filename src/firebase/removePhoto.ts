import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "./firebaseConfig";

interface IRemoveFileParams {
    url: string; 
    id: string; 
}

// Removes the file, and updates the product document
export default async function removePhotoFromProduct({ url, id }: IRemoveFileParams): Promise<boolean> {
  try {
        const fileRef = ref(storage, url);
        const docRef = doc(db, "product", id);
        
        // First, get current photos
        const productDoc = await getDoc(docRef);
        const oldPhotos = productDoc.data()?.photos || [];

        // Update document in transaction
        await updateDoc(docRef, {
            photos: oldPhotos.filter((photo: string) => photo !== url)
        });

        // After successful document update, delete the file
        await deleteObject(fileRef);
        
        console.log('File and document deleted successfully');
        return true;
    } catch (error) {
        console.error('Error removing photo:', error);
        return false;
    }
}