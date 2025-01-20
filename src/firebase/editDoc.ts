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
    stripeProductId: string; 
    stripePriceId: string;
}

export default async function editDoc({ id, title, description, price, tags, imageUrl, series, seriesOrder=0, stripeProductId, stripePriceId }: IEditDoc) {
    try {
        const docRef = doc(db, "photos", id);
        console.log('editing doc', docRef.path);

        if (imageUrl) {
            console.log('imageUrl found: ', imageUrl);
            await updateDoc(docRef, {
                title,
                description,
                price,
                tags,
                imageUrl,
                series,
                seriesOrder,
                stripeProductId, 
                stripePriceId
            });
            return;

        } else {
            console.log('no imageUrl found');
            await updateDoc(docRef, {
                title,
                description,
                price,
                tags,
                series,
                seriesOrder,
                stripeProductId, 
                stripePriceId
            });
            
        }
    } catch (error) {
        console.log("Error updating document: ", error);

    }

}