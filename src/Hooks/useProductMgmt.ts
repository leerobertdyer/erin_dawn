import { useEffect, useState } from 'react';
import { IProductInfo } from '../Interfaces/IProduct';
import removeProduct from '../firebase/removeProduct';
import { removeFile } from '../firebase/removeFile';
import { getPhoto, getPhotos } from '../firebase/getFiles';
import { editDoc } from '../firebase/editDoc';

export function useProductManagement() {

    const [isEditing, setIsEditing] = useState(false);
    const [isBatchEdit, setIsBatchEdit] = useState(false);
    const [product, setProduct] = useState<IProductInfo | null>(null);
    const [previousUrl, setPreviousUrl] = useState<string>('/');
    const [filteredInventory, setFilteredInventory] = useState<IProductInfo[]>([]);
    const [cartProducts, setCartProducts] = useState<IProductInfo[]>(() => {
        const savedProducts = localStorage.getItem('cartProducts');
        return savedProducts ? JSON.parse(savedProducts) : [];
    });

    useEffect(() => {
        if (cartProducts.length > 0) {
            localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
        } else {
            localStorage.removeItem('cartProducts');
        }
    }, [cartProducts])

    const handleEdit = async (id: string) => {
        const photoData = await getPhoto({id});
        setIsBatchEdit(false);
        const productData = {
            title: photoData.title,
            description: photoData.description,
            price: photoData.price,
            size: photoData.size,
            dimensions: photoData.dimensions,
            tags: photoData.tags,
            imageUrl: photoData.imageUrl,
            id: id,
            series: photoData.series,
            itemName: photoData.itemName,
            itemOrder: photoData.itemOrder,
            stripePriceId: photoData.stripePriceId,
            stripeProductId: photoData.stripeProductId
        };
        setIsEditing(() => {
            setProduct(productData);
            return true;
        })
    };
    
   async function cleanupSeriesNumbers(id: string) {
        // If this is part of a series (has itemName and itemOrder), update other items first
        const photoData = await getPhoto({id});  // Get current photo data
        if (photoData.itemName && photoData.itemOrder) {
            const seriesPhotos = (await getPhotos({tags: ["inventory"]})).filter(photo => photo.itemName === photoData.itemName);
            console.log('seriesPhotos inside useProductMgmt cleanupSeriesNumbers', seriesPhotos);
            // Update itemOrder for all photos after the deleted one
            const updates = seriesPhotos
                .filter(p => p.itemOrder > photoData.itemOrder)
                .map(photo => 
                    editDoc({
                        ...photo,
                        size: photo.size,
                        itemOrder: photo.itemOrder - 1
                    })
                );
            
            if (updates.length > 0) {
                await Promise.all(updates);
            }
        } else {
            console.log("No series information found for product.id", id);
        }

    }

    const handleDelete = async (url: string, id: string) => {
        await cleanupSeriesNumbers(id);

        const success = await removeProduct({ url, id });
        setIsEditing(false);
        
        if (!success) {  // fallback to remove individual files
            try {  
                await removeFile({ url });
                await removeProduct({ url, id });
            } catch (error) {
                console.error("Error in cleanup:", error);
                return false;
            }
            return false;
        }
        return true;
    };


    const handleBack = () => {
        setIsBatchEdit(false);
        setIsEditing(false);
    }

    return {
        isEditing, setIsEditing,
        isBatchEdit, setIsBatchEdit,
        product, setProduct,
        filteredInventory, setFilteredInventory,
        cartProducts, setCartProducts,
        previousUrl, setPreviousUrl,
        handleEdit,
        handleDelete,
        handleBack,
    };
}