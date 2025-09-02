import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { IProductInfo } from "../Interfaces/IProduct";
import { IGeneralPhoto } from "../Interfaces/IPhotos";
import { ICategory } from "../Interfaces/ICategory";
import { IHero } from "../Interfaces/IHero";
import { ISeries } from "../Interfaces/ISeries";

async function addNewSeries(series: ISeries) {
try {
    const docRef = doc(db, "series", series.id);
    console.log('adding doc', docRef.path);
    
    await setDoc(docRef, {name: series.name, photos: series.photos});
} catch (error) {
    console.log("Error updating document: ", error);
}
}

async function editSeriesDoc(series: ISeries) {
    try {
        const docRef = doc(db, "series", series.id);
        console.log('editing doc', docRef.path);
        
        await updateDoc(docRef, {name: series.name, photos: series.photos});
    } catch (error) {
        console.log("Error updating document: ", error);
    }
}

async function editProductDoc({ id, title, description, price, series, category, photos, stripeProductId, hidden, stripePriceId, size, dimensions, sold }: IProductInfo): Promise<boolean> {
    try {
        // Validate that we have an ID
        if (!id) {
            console.error('Cannot update document: Missing ID');
            return false;
        }
        
        const docRef = doc(db, "product", id);
        console.log('Editing product document:', {
            path: docRef.path,
            id,
            title,
            sold // Log the sold status explicitly
        });
        
        // Create the update object
        const updateData = {
            title,
            description,
            price,
            size,
            dimensions,
            hidden,
            category,
            series,
            photos,
            stripeProductId,
            sold,
            stripePriceId
        };
        
        console.log('Update data:', JSON.stringify(updateData));
        
        // Perform the update
        await updateDoc(docRef, updateData);
        
        // If we get here, the update was successful
        console.log(`Document successfully updated with ID: ${id}, sold status: ${sold}`);
        return true;
    } catch (error) {
        console.error("Error updating document: ", error);
        return false;
    }
}

function buildPhotoUpdateData(photoData: Partial<IGeneralPhoto>): Partial<IGeneralPhoto> {
    // Create an update object with only defined fields
    const updateData: Partial<IGeneralPhoto> = {};
    if (photoData.category !== undefined) updateData.category = photoData.category;
    if (photoData.title !== undefined) updateData.title = photoData.title;
    if (photoData.url !== undefined) updateData.url = photoData.url;
    if (photoData.tags !== undefined) updateData.tags = photoData.tags;
    if (photoData.order !== undefined) updateData.order = photoData.order;
    return updateData;
}

async function editPhotoDoc(photoData: Partial<IGeneralPhoto> & { id: string }) {
    try {
        const docRef = doc(db, "photos", photoData.id);
        console.log('editing doc', docRef.path);
        
        const updateData = buildPhotoUpdateData(photoData);
        await updateDoc(docRef, updateData);
    } catch (error) {
        console.log("Error updating document: ", error);
    }
}

async function editCategoryDoc(category: ICategory) {
    try {
        const docRef = doc(db, "category", category.id);
        console.log('editing doc', docRef.path);
        
        await updateDoc(docRef, {name: category.name, series: category.series, url: category.url});
    } catch (error) {
        console.log("Error updating document: ", error);
    }
}

async function editHeroDoc(hero: IHero) {
    try {
        const docRef = doc(db, "hero", hero.id);
        console.log('editing doc', docRef.path);
        
        await updateDoc(docRef, {url: hero.url});
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

export { editProductDoc, updateAboutText, shipOrder, editCategoryDoc, editPhotoDoc, buildPhotoUpdateData, editHeroDoc, editSeriesDoc, addNewSeries }