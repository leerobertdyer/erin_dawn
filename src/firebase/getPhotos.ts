import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { IProductInfo } from "../Interfaces/ProductImage";
import shuffleArray from "../util/shuffle";

export async function getPhotos({ tags, shuffle }: { tags: string[], shuffle?: boolean }): Promise<IProductInfo[]> {
    const q = query(collection(db, "photos"), where("tags", "array-contains-any", tags));
    const querySnapshot = await getDocs(q);
    const photosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    console.log("photosData", photosData);
    shuffle && shuffleArray(photosData);
    return photosData as IProductInfo[];
}

export async function getPhoto({ id }: { id: string }): Promise<IProductInfo> {
    const docRef = doc(db, "photos", id);
    const photo = await getDoc(docRef);

    if (photo.exists()) {
        return {
            id: photo.id,
            ...photo.data()
        } as IProductInfo;
    } else {
        throw new Error("No such document!");
    }
}