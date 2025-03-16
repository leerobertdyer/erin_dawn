import {  doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import IAddNewSale from "../Interfaces/IAddNewSale";
import { INewProduct } from "../Interfaces/IProduct";
import { IGeneralPhoto } from "../Interfaces/IPhotos";
import { buildPhotoUpdateData } from "./editDoc";
import { ICategory } from "../Interfaces/ICategory";

async function addNewProductDoc({ title, description, price, size, dimensions, hidden, series, stripeProductId, stripePriceId, category, photos, sold }: INewProduct): Promise<string | null> {
  const customDocId = title.replace(/\s/g, "_") + "_" + new Date().getTime();
  try {
    console.log("Adding document to firestore: ", customDocId);
    let id = '';
    try {
      await setDoc(doc(db, "product", customDocId), {
        title,
        description,
        price,
        size,
        dimensions,
        hidden,
        series,
        category,
        photos,
        sold,
        createdAt: new Date(),
        stripeProductId,
        stripePriceId
      });
      id = customDocId;
      console.log("Document successfully written with ID: ", id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
    return id;
  } catch (e) { 
    console.error("Error adding document: ", e);
    return null;
  }
}

async function addNewPhotoDoc({  url, tags, order, category }: IGeneralPhoto): Promise<string | null> {
  const customDocId = category.replace(/\s/g, "_") + "_" + new Date().getTime();
  const photoUpdateData = buildPhotoUpdateData({ url, tags, order, category });

  try {
    console.log("Adding photo to firestore: ", customDocId);
    let id = '';
    try {
      await setDoc(doc(db, "photos", customDocId), photoUpdateData);
      id = customDocId;
      console.log("Document successfully written with ID: ", id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
    return id;
  } catch (e) { 
    console.error("Error adding document: ", e);
    return null;
  }
}


async function addNewCategory(category: ICategory): Promise<boolean> {
    console.log("Creating doc in category collection with ID:", category.name);
    let success = false;
    try {
      const safeId = category.name.replace(/\s/g, "_") + "_" + new Date().getTime();
      const docRef = doc(db, "category", safeId);
      await setDoc(docRef, {
        name: category.name,
        series: category.series,
        url: category.url
      });
      success = true;
      console.log("Category document created successfully");
    } catch (error) {
      console.error("Error in addNewCategory:", error);
    }
    return success;
}


async function addNewSale({ customerName, shippingAddressString, sessionId, isShipped, totalSales, itemsSold }: IAddNewSale ) {
  try {
    console.log("Adding sale to firestore: ", sessionId);
    const safeName = customerName.replace(/\s/g, "_");
    const customId = safeName + "_" + sessionId;
    await setDoc(doc(db, "sales", customId), {
      createdAt: new Date(),
      customerName,
      shippingAddressString,
      sessionId,
      isShipped,
      totalSales,
      itemsSold,
    });
  } catch (e) {
    console.error("Error adding sale: ", e);
  }
}

async function editSale({ id }: { id: string }) {
  try {
    console.log("Editing sale in firestore: ", id);
    await updateDoc(doc(db, "sales", id), {
      isShipped: true
    });
  } catch (e) {
    console.error("Error editing sale: ", e);
  }
}


export { addNewProductDoc, addNewCategory, addNewSale, editSale, addNewPhotoDoc };