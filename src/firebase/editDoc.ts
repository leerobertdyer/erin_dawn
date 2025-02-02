import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

interface IEditDoc {
    id: string;
    title: string;
    description: string;
    price: number;
    size: string;
    tags: string[];
    imageUrl?: string;
    series?: string;
    itemOrder?: number;
    itemName?: string;
    stripeProductId: string; 
    stripePriceId: string;
}

export default async function editDoc({ id, title, description, price, tags, imageUrl, series, itemOrder=0, itemName, stripeProductId, stripePriceId, size }: IEditDoc) {
    try {
        const docRef = doc(db, "photos", id);
        console.log('editing doc', docRef.path);

        if (imageUrl) {
            console.log('imageUrl found: ', imageUrl);
            await updateDoc(docRef, {
                title,
                description,
                price,
                size,
                tags,
                imageUrl,
                series,
                itemOrder,
                itemName,
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
                size,
                tags,
                series,
                itemOrder,
                itemName,
                stripeProductId, 
                stripePriceId
            });
            
        }
    } catch (error) {
        console.log("Error updating document: ", error);

    }

}