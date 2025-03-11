import { useEffect, useState } from 'react';
import { IProductInfo } from '../Interfaces/IProduct';
import removePhotoFromProduct from '../firebase/removePhoto';
import { getPhotos, getProducts } from '../firebase/getFiles';
import { editProductDoc } from '../firebase/editDoc';
import { IGeneralPhoto } from '../Interfaces/IPhotos';
import { ICategory } from '../Interfaces/ICategory';
import { removeFiles } from '../firebase/removeFile';
import { removeProductDoc } from '../firebase/removeDoc';
import { getCategories } from '../firebase/getCategories';
import { IHero } from '../Interfaces/IHero';
import { getHero } from '../firebase/getHero';

export function useProductManagement() {

    const [isEditing, setIsEditing] = useState(false);
    const [productToEdit, setProductToEdit] = useState<IProductInfo | null>(null);
    const [previousUrl, setPreviousUrl] = useState<string>('/');
    const [allProducts, setAllProducts] = useState<IProductInfo[]>([]);
    const [filteredInventory, setFilteredInventory] = useState<IProductInfo[]>([]);
    const [allCategories, setAllCategories] = useState<ICategory[]>([]);
    const [heroPhotos, setHeroPhotos] = useState<IHero[]>([]);
    const [cartProducts, setCartProducts] = useState<IProductInfo[]>(() => {
        const savedProducts = localStorage.getItem('cartProducts');
        return savedProducts ? JSON.parse(savedProducts) : [];
    });

    useEffect(() => {
        async function fetchCategories() {
            const categories = await getCategories();
            setAllCategories(categories);
        }
        fetchCategories();
    }, [])

    useEffect(() => {
        async function fetchHeroPhotos() {
            const heroPhotos = await getHero();
            setHeroPhotos(heroPhotos);
        }
        fetchHeroPhotos();
    }, [])

    useEffect(() => {
        if (cartProducts.length > 0) {
            localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
            localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
        } else {
            localStorage.removeItem('cartProducts');
        }
    }, [cartProducts])

    useEffect(() => {
        async function fetchProducts() {
            const products = await getProducts();
            setAllProducts(products);
        }
        fetchProducts();
    }, [])

    const handleEditProduct = async (product: IProductInfo) => {
        const productData = {
            title: product.title,
            sold: product.sold,
            description: product.description,
            price: product.price,
            size: product.size,
            dimensions: product.dimensions,
            photos: product.photos,
            id: product.id,
            series: product.series,
            stripePriceId: product.stripePriceId,
            stripeProductId: product.stripeProductId,
            hidden: product.hidden  
        };
        setIsEditing(() => {
            setProductToEdit(productData);
            return true;
        })
    };
    
   async function cleanupSeriesNumbers(product: IProductInfo, photo: IGeneralPhoto) {
    // If the order is above the deleted file, this decrements it to avoid gaps in the series order
        const seriesPhotos = product.photos.map((p: IGeneralPhoto) => {
               return p.order > photo.order ? {
                    ...p,
                    order: p.order - 1
                } : p
            })
        editProductDoc({
            ...product,
            photos: seriesPhotos
        })

    }

    const handleDeletePhoto = async (product: IProductInfo, photo: IGeneralPhoto) => {
        await cleanupSeriesNumbers(product, photo);

        try {  
            await removePhotoFromProduct({ url: photo.url, id: product.id });
            setIsEditing(false);
        } catch (error) {
            console.error("Error in cleanup:", error);
            setIsEditing(false);
            return false;
        }
        return true;
    };

    const handleDeleteProduct = async (product: IProductInfo) => {
        try {
            // First get all files associated with this product
            const photoIds = product.photos.map((p: IGeneralPhoto) => p.id);
            const photos = await getPhotos({ids: photoIds});
            const photoUrls = photos.map((p: IGeneralPhoto) => p.url);
            await removeFiles({urls: photoUrls});
            await removeProductDoc({ id: product.id });
            console.log("Product Deleted Successfully")
        } catch (error) {
            console.error(`Error during cleanup in handleDeleteProduct: ${error}`)
        }
    }


    return {
        isEditing, setIsEditing,
        heroPhotos, setHeroPhotos,
        productToEdit, setProductToEdit,
        cartProducts, setCartProducts,
        previousUrl, setPreviousUrl,
        filteredInventory, setFilteredInventory,
        allCategories, setAllCategories,
        allProducts, setAllProducts,
        handleEditProduct,
        handleDeletePhoto, handleDeleteProduct,
    };
}