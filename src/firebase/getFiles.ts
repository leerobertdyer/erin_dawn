import { collection, doc, getDoc, getDocs, query, where, DocumentData, Query, } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { IProductInfo } from "../Interfaces/IProduct";
import shuffleArray from "../util/shuffle";
import { IGeneralPhoto } from "../Interfaces/IPhotos";
import { ISeries } from "../Interfaces/ISeries";

interface IGetPhotos {
    tags?: string[],
    ids?: string[],
    shuffle?: boolean
}


export async function getPhotos({ tags, ids, shuffle }: IGetPhotos): Promise<IGeneralPhoto[]> {
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
        // const freshUrl = await getFreshDownloadURL(data.url);
        return {
            id: doc.id,
            ...data,
            url: data.url,
            tags: data.tags || [],
            title: data.title || ""
        };
    }));

    if (shuffle) shuffleArray(photosData);
    return photosData as IGeneralPhoto[];
}
export async function getProducts(): Promise<IProductInfo[]> {
    const c = collection(db, "product");
    const querySnapshot = await getDocs(c);
    const productsData = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data
        } as IProductInfo;
    }));
    return productsData;
}

export async function getProduct({ id }: { id: string }): Promise<IProductInfo> {
    const docRef = doc(db, "product", id);
    const product = await getDoc(docRef);

    if (product.exists()) {
        return {
            id: product.id,
            ...product.data()
        } as IProductInfo;
    } else {
        throw new Error("No such document!");
    }
}

export async function getPhoto({ id }: { id: string }): Promise<IGeneralPhoto> {
    const docRef = doc(db, "photos", id);
    const photo = await getDoc(docRef);

    if (photo.exists()) {
        return {
            id: photo.id,
            ...photo.data()
        } as IGeneralPhoto;
    } else {
        throw new Error("No such document!");
    }
}

export async function getAboutText(): Promise<{ long: string, short: string, longHeader: string }> {
    const docRef = doc(db, "texts", "about");
    const docSnap = await getDoc(docRef)
    const textObject = { long: "", short: "", longHeader: "" };

    if (docSnap.exists()) {
        const data = docSnap.data();
        textObject.long = data.long;
        textObject.short = data.short;
        textObject.longHeader = data.longHeader;
    }

    return textObject;
}

export async function getSeries(): Promise<DocumentData[]> {
    const docRef = await getDocs(collection(db, "series"));
    const series = docRef.docs.map(doc => 
    {
        return {
            id: doc.id,
            ...doc.data()
        } as ISeries;
    });
    return series;
}

export async function getOrders(): Promise<DocumentData[]> {
    const docRef = await getDocs(collection(db, "sales"));
    const orders = docRef.docs.map(doc => doc.data());
    return orders;
}