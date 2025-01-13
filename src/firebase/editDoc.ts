import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

interface IEditDoc {
    id: string;
    title: string;
    description: string;
    price: number;
    tags: string[];
    imageUrl?: string;
    series?: string;
    seriesOrder?: number;
}

export default async function editDoc({ id, title, description, price, tags, imageUrl, series, seriesOrder }: IEditDoc) {
    try {
        const docRef = doc(db, "photos", id);
        console.log('editing doc', docRef.path);

        if (imageUrl) {
            console.log('imageUrl found: ', imageUrl);
            await updateDoc(docRef, {
                title: title,
                description: description,
                price: price,
                tags: tags,
                imageUrl: imageUrl,
                series: series,
                seriesOrder: seriesOrder
            });
            return;

        } else {
            console.log('no imageUrl found');
            await updateDoc(docRef, {
                title: title,
                description: description,
                price: price,
                tags: tags,
                series: series,
                seriesOrder: seriesOrder
            });
            
        }
    } catch (error) {
        console.log("Error updating document: ", error);

    }

}