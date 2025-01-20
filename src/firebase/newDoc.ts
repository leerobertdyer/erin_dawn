import { addDoc, collection, DocumentReference } from "firebase/firestore";
import { db } from "./firebaseConfig";

interface INewDoc {
  downloadURL: string;
  title: string;
  description: string;
  price: number;
  tags: string[];
  series: string;
  seriesOrder: number;
  stripeProductId: string;
  stripePriceId: string;
}

export default async function newDoc({ downloadURL, title, description, price, tags, series, seriesOrder, stripeProductId, stripePriceId }: INewDoc): Promise<string | null> {
  try {
    const docRef: DocumentReference = await addDoc(collection(db, "photos", title), {
      imageUrl: downloadURL,
      title: title,
      description: description,
      price: price,
      tags: tags,
      series: series,
      seriesOrder: seriesOrder,
      createdAt: new Date(),
      stripeProductId, 
      stripePriceId
    });
    console.log("Document successfully written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    return null;
  }
}