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
    category?: string;
    itemOrder?: number;
    itemName?: string;
    stripeProductId: string;
    stripePriceId: string;
}

async function editDoc({ id, title, description, price, tags, imageUrl, series, category, itemOrder = 0, itemName, stripeProductId, stripePriceId, size }: IEditDoc) {
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
                category,
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
                category,
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

async function updateAboutText({ short, long, longHeader }: { short: string, long: string, longHeader: string }) {
    try {
        const docRef = doc(db, "texts", "about");
        await updateDoc(docRef, {
            short,
            long,
            longHeader
        });
    } catch (error) {
        console.error("Error updating about text: ", error);
    }
}

async function shipOrder({ id }: { id: string }) {
    try {
        const docRef = doc(db, "sales", id);
        await updateDoc(docRef, {
            isShipped: true
        });
    } catch (error) {
        console.error("Error updating order: ", error);
    }
}

export { editDoc, updateAboutText, shipOrder }