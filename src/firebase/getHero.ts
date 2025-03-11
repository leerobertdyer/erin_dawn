import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { IHero } from "../Interfaces/IHero";

export async function getHero(): Promise<IHero[]> {
    const c = collection(db, "hero");
    const querySnapshot = await getDocs(c);
    const heroData = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        return {
            url: data.url,
            id: doc.id
        } as IHero;
    }));
    return heroData;
}
