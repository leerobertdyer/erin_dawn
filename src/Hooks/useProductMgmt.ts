import { useState } from 'react';
import { IProductInfo } from '../Interfaces/IProduct';
import removeProduct from '../firebase/removeProduct';
import removeFile from '../firebase/removeFile';
import { getPhoto } from '../firebase/getPhotos';

export function useProductManagement() {
    const [isEditing, setIsEditing] = useState(false);
    const [isBatchEdit, setIsBatchEdit] = useState(false);
    const [product, setProduct] = useState<IProductInfo | null>(null);
    const [cartProducts, setCartProducts] = useState<IProductInfo[]>([]);

    const handleEdit = async (id: string) => {
        const photoData = await getPhoto({ id });
        setIsBatchEdit(false);
        
        const productData = {
            title: photoData.title,
            description: photoData.description,
            price: photoData.price,
            tags: photoData.tags,
            imageUrl: photoData.imageUrl,
            id: id,
            series: photoData.series,
            seriesOrder: photoData.seriesOrder,
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
            try {
                await removeFile({ url });
                await removeProduct({ url, id });
            } catch (error) {
                console.error("Error in cleanup:", error);
                return false;
            }
        }
        return true;
    };

    const handleBack = () => {
        setIsBatchEdit(false);
        setIsEditing(false);
    }

    const handleAddToCart = (product: IProductInfo) => {
        //TODO: implement add to cart
        console.log(product)
    }

    const handleRemoveFromCart = (product: IProductInfo) => {
        //TODO: implement remove from cart
        console.log(product)
    }

    const handleBatchEdit = () => {
        setIsBatchEdit(true);
    }

    const handleSetCartProducts = (products: IProductInfo[]) => {
        setCartProducts(products);
    }

    return {
        isEditing, setIsEditing,
        isBatchEdit,
        product, setProduct,
        cartProducts, setCartProducts,
        handleEdit,
        handleDelete,
        handleBack,
        handleAddToCart,
        handleRemoveFromCart,
        handleBatchEdit,
        handleSetCartProducts
    };
}