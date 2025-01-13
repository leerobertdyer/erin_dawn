import { useState } from 'react';
import { IProductInfo, IProductToEdit } from '../Interfaces/IProduct';
import removeProduct from '../firebase/removeProduct';
import removeFile from '../firebase/removeFile';
import { getPhoto } from '../firebase/getPhotos';

export function useProductManagement() {
    const [isEditing, setIsEditing] = useState(false);
    const [isBatchEdit, setIsBatchEdit] = useState(false);
    const [product, setProduct] = useState<IProductToEdit | null>(null);
    const [updatedProduct, setUpdatedProduct] = useState<IProductToEdit | null>(null);
    const [cartProducts, setCartProducts] = useState<IProductInfo[]>([]);
  

    const handleFinishEdit = () => {
        setIsEditing(false);
    }

    const handleEdit = async (id: string) => {
        const photoData = await getPhoto({ id });
        setIsBatchEdit(false);
        
        const productData = {
            title: photoData.title,
            description: photoData.description,
            price: photoData.price,
            tags: photoData.tags,
            url: photoData.imageUrl,
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

    const updateProduct = (newProduct: IProductToEdit) => {
        setUpdatedProduct(newProduct);
        setProduct(null);
        setIsEditing(false);
    };

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
        isEditing,
        isBatchEdit,
        product,
        cartProducts, setCartProducts,
        updateProduct,
        updatedProduct,
        handleEdit,
        handleDelete,
        handleBack,
        handleAddToCart,
        handleRemoveFromCart,
        handleFinishEdit,
        handleBatchEdit,
        handleSetCartProducts
    };
}