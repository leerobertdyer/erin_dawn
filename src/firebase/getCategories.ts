import { collection, getDocs, } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { ICategory } from "../Interfaces/ICategory";

export async function getCategories(): Promise<ICategory[]> {
    const c = collection(db, "category");
    const querySnapshot = await getDocs(c);
    const categoriesData = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            series: data.series,
            url: data.url
        } as ICategory;
    }));
    return categoriesData;
}
