import { collection, getDocs, query, } from "firebase/firestore";
import { db } from "./firebaseConfig";

export interface ICategory {
    name: string;
    series: string[];
}
 async function getCategories(): Promise<ICategory[]> {
    const c = collection(db, "categories");
    const q = query(c);
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        console.log("No categories found");
        return [];
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();
    const categories = data.categories || [];

    return categories;
}


export { getCategories };