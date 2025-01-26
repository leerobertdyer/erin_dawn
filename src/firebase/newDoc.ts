import { addDoc, collection, DocumentReference } from "firebase/firestore";
import { db } from "./firebaseConfig";

interface INewDoc {
  downloadUrl: string;
  title: string;
  description: string;
  price: number;
  tags: string[];
  series: string;
  seriesOrder: number;
  stripeProductId: string;
  stripePriceId: string;
}

export default async function newDoc({ downloadUrl, title, description, price, tags, series, seriesOrder, stripeProductId, stripePriceId }: INewDoc): Promise<string | null> {
  try {
    console.log("Adding document to firestore: ", title);
    const docRef: DocumentReference = await addDoc(collection(db, "photos"), {
      imageUrl: downloadUrl,
      title,
      description,
      price,
      tags,
      series,
      seriesOrder,
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