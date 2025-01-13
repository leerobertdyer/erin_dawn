import { collection, doc, getDoc, getDocs, query, where, DocumentData, Query, } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { IProductInfo } from "../Interfaces/IProduct";
import shuffleArray from "../util/shuffle";

interface IGetPhotos {
    tags?: string[],
    ids?: string[],
    shuffle?: boolean
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
    const photosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
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
            ...photo.data()
        } as IProductInfo;
    } else {
        throw new Error("No such document!");
    }
}