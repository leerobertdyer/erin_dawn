import { useEffect, useState } from 'react';
import { IProductInfo } from '../Interfaces/IProduct';
import removeProduct from '../firebase/removeProduct';
import { removeFile } from '../firebase/removeFile';
import { getPhoto } from '../firebase/getPhotos';

export function useProductManagement() {

    const [isEditing, setIsEditing] = useState(false);
    const [isBatchEdit, setIsBatchEdit] = useState(false);
    const [product, setProduct] = useState<IProductInfo | null>(null);
    const [previousUrl, setPreviousUrl] = useState<string>('/');
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
        console.log(photoData);
        setIsBatchEdit(false);
        const productData = {
            title: photoData.title,
            description: photoData.description,
            price: photoData.price,
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
    

    const handleDelete = async (url: string, id: string) => {
        const success = await removeProduct({ url, id });
        setIsEditing(false);
        
        if (!success) { 
            try { // TODO remove this trycatch after development to avoid data mismanagement
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
        cartProducts, setCartProducts,
        previousUrl, setPreviousUrl,
        handleEdit,
        handleDelete,
        handleBack,
    };
}