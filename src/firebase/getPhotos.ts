import { collection, doc, getDoc, getDocs, query, where, DocumentData, Query, } from "firebase/firestore";
import { db, storage } from "./firebaseConfig";
import { IProductInfo } from "../Interfaces/IProduct";
import shuffleArray from "../util/shuffle";
import { getDownloadURL, ref } from "firebase/storage";

interface IGetPhotos {
    tags?: string[],
    ids?: string[],
    shuffle?: boolean
}

// Fetch download URL with a timestamp for cache-busting
async function getFreshDownloadURL(imageUrl: string): Promise<string> {
    try {
        const storagePath = decodeURIComponent(imageUrl.split("?")[0].split("/o/")[1]); // Extract path
        const storageRef = ref(storage, storagePath);
        const url = await getDownloadURL(storageRef);
        return url
    } catch (error) {
        console.error("Error fetching new download URL:", error);
        return imageUrl; // Fallback to the stored URL
    }
}

export async function getPhotos({ tags, ids, shuffle }: IGetPhotos ): Promise<IProductInfo[]> {
    const c = collection(db, "photos");
    let q: Query<DocumentData> | null = null;
    if (tags) {
         q = query(c, where("tags", "array-contains-any", tags));
    } else if (ids) {
        q = query(c, where("id", "in", ids));
    }
    if (!q) {
        throw new Error("No query provided");
    }
    const querySnapshot = await getDocs(q);
    const photosData = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const freshUrl = await getFreshDownloadURL(data.imageUrl);
        return {
            id: doc.id,
            ...data,
            imageUrl: freshUrl
        };
    }));

    shuffle && shuffleArray(photosData);
    return photosData as IProductInfo[];
}

export async function getPhoto({ id }: { id: string }): Promise<IProductInfo> {
    const docRef = doc(db, "photos", id);
    const photo = await getDoc(docRef);

    if (photo.exists()) {
        return {
            id: photo.id,
            imageUrl: photo.data().imageUrl ? photo.data().imageUrl + '?t=' + new Date().getTime() : '',
            ...photo.data()
        } as IProductInfo;
    } else {
        throw new Error("No such document!");
    }
}