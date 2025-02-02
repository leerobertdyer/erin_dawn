import { addDoc, collection, DocumentReference, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

interface INewDoc {
  downloadUrl: string;
  title: string;
  itemName?: string;
  description: string;
  price: number;
  size: string;
  tags: string[];
  series: string;
  category: string;
  itemOrder: number;
  stripeProductId: string;
  stripePriceId: string;
}

async function newDoc({ downloadUrl, title, description, price, size, tags, series, itemOrder, stripeProductId, stripePriceId, itemName, category }: INewDoc): Promise<string | null> {
  if (!itemName) itemName = title;
  if (!category) category = "uncategorized";
  try {
    console.log("Adding document to firestore: ", title);
    const docRef: DocumentReference = await addDoc(collection(db, "photos"), {
      imageUrl: downloadUrl,
      title,
      description,
      price,
      size,
      tags,
      series,
      itemName,
      category,
      itemOrder,
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

async function addNewCategory({ category, series }: { category: string, series: string }): Promise<boolean> {
  let success = false;
  try {
    console.log("Adding category to firestore: ", category);
    const docRef = await getDocs(collection(db, "categories"));
    const categories = docRef.docs[0].data().categories;
    const updatedCategories = [...categories, { name: category, series: [series] }];

    await updateDoc(docRef.docs[0].ref, {
      categories: updatedCategories
    });
    success = true;
  } catch (e) {
    console.error("Error adding category: ", e);
    success = false;
  }
  return success;
}

async function addNewSeries({ series, category }: { series: string, category: string }): Promise<boolean> {
  let success = false;

  try {
      // Query the categories collection to find the document with the matching category name
      const categoriesRef = collection(db, "categories");
      const query = await getDocs(categoriesRef);
      const categoryDocRef = query.docs[0].ref;
      const categories = query.docs[0].data().categories;

      if (categories.length > 0) {
        console.log('categories found: ', categories);
        console.log('category to add to: ', category);
        console.log('series to add: ', series);
        
        // Find the index of the category to update
        const categoryIndex = categories.findIndex((cat: any) => cat.name === category);
        if (categoryIndex === -1) {
          console.error("Category not found");
          return false;
        }
  
        // Update the series array for the matching category
        const updatedCategories = [...categories];
        updatedCategories[categoryIndex].series = [...(updatedCategories[categoryIndex].series || []), series];
  
        // Update the document with the modified categories array
        await updateDoc(categoryDocRef, {
          categories: updatedCategories
        });
  
        success = true;
      } else {
        console.error("No categories document found");
      }
    } catch (error) {
      console.error("Error adding series: ", error);
      success = false;
    }

  return success;
}


export { newDoc, addNewCategory, addNewSeries };