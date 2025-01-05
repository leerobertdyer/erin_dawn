import { addDoc, collection, DocumentReference } from "firebase/firestore";
import { db } from "./firebaseConfig";

interface IParams {
  downloadURL: string;
  title: string;
  description: string;
  price: number;
  tags: string[];
}

export default async function newDoc({ downloadURL, title, description, price, tags }: IParams): Promise<string | null> {
  try {
    const docRef: DocumentReference = await addDoc(collection(db, "photos"), {
      imageUrl: downloadURL,
      title: title,
      description: description,
      price: price,
      tags: tags,
      createdAt: new Date()
    });
    console.log("Document successfully written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    return null;
  }
}