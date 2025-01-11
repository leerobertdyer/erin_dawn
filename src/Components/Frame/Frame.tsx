import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import ProductForm from "../ProductForm/ProductForm";
import { getPhoto } from "../../firebase/getPhotos";
import removeProduct from "../../firebase/removeProduct";
import removeFile from "../../firebase/removeFile";
import AdminButtons from "./AdminButtons";
import { IProductInfo, IProductToEdit } from "../../Interfaces/IProduct";
import ShoppingButtons from "./ShoppingButtons";
import BatchEdit from "../BatchEdit/BatchEdit";

interface IFrameProps {
    src?: string;
    alt?: string;
    name?: string;
    additionalClass?: string;
    hover?: boolean;
    spin?: boolean;
    series?: string;
    seriesOrder?: number;
    u: User | null;
    id?: string
    onDelete?: (id: string) => void;
    isInventory?: boolean;
    photos?: IProductInfo[];
    handleClickProductDetails?: (index: number) => void;
    arrayIndex?: number;
    children?: React.ReactNode;
}

export default function Frame({ src, alt, name, additionalClass, hover, u, id, onDelete, isInventory, spin, photos, handleClickProductDetails, arrayIndex, children }: IFrameProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isBatchEdit, setIsBatchEdit] = useState(false);
    const [product, setProduct] = useState<IProductToEdit | null>(null);
    const [updatedProduct, setUpdatedProduct] = useState<IProductInfo | null>(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isCarousel, setIsCarousel] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isCarousel && photos) {
            setCurrentPhotoIndex(1);
            interval = setInterval(() => {
                setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
            }, 1000);
            return () => clearInterval(interval);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
                setCurrentPhotoIndex(0);
                setIsCarousel(false);
            }
        };
    }, [isCarousel, photos]);

    function handleMouseEnter() {
        if (photos && photos.length > 1) {
            setIsCarousel(true);
        }
    }

    function handleMouseLeave() {
        setCurrentPhotoIndex(0);
        setIsCarousel(false);
    }

    function updateProduct(newProduct: IProductInfo) {
        console.log("Finalizing Edit")
        setUpdatedProduct(newProduct);
        setProduct(null);
        setIsEditing(false);
    }

    async function handleDelete(url: string) {
        if (!url || !id) {
            if (photos && photos[0].id && photos[0].imageUrl) {
                url = photos[0].imageUrl;
                id = photos[0].id;
            } else {
                return;
            }
        }
        const success = await removeProduct({ url, id });
        onDelete && onDelete(id);
        setIsEditing(false);
        if (success) {
            // TODO: handle success message
            console.log("Product deleted successfully");

        } else {
            // Temporarily allow separate removal
            // TODO: Remove this option to avoid orphaned files
            try {
                console.log("Deleting file only");
                await removeFile({ url });
            } catch (error) {
                console.log("Error deleting file");
            }
            try {
                console.log("Deleting document only");
                await removeProduct({ url, id });
            } catch (error) {
                console.log("Error deleting document");
            }
            //TODO: Show error modal
            console.log("Error deleting product");
        }
    }

    async function handleEdit() {
        if (!id) {
            // Early return if no valid photos
            if (!photos || !photos?.[0]?.id) return;
            // Single photo case
            if (photos.length === 1) {
                id = photos[0].id;
            } else {
                // Batch edit case
                id = photos[0].id;
                setIsBatchEdit(true);
            }
        } 
        if (id) {
            // Single photo case
            setIsEditing(true);
            const photoData = await getPhoto({ id });
            setProduct({
                title: photoData.title,
                description: photoData.description,
                price: photoData.price,
                tags: photoData.tags,
                disabled: false,
                url: photoData.imageUrl,
                id: id,
                series: photoData.series,
                seriesOrder: photoData.seriesOrder,
                onProductUpdate: updateProduct,
                onPruductDelete: handleDelete
            })
        }
    }

    function handleBack() {
        setIsBatchEdit(false);
        setIsEditing(false);
    }

    return (
        (isBatchEdit) ? <BatchEdit products={photos ?? []} u={u} handleBack={handleBack} />
            : (isEditing && product)
                ?
                <div className="w-screen h-screen bg-white fixed top-0 left-0 z-50 flex justify-center items-center">
                    <ProductForm product={product} />
                </div>
                :
                <div className={`
                ${hover && "cursor-pointer transition-all duration-1000"} 
                ${spin && "hover:[transform:rotateY(180deg)]"}
            ${additionalClass && additionalClass} flex-col h-full w-full`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}>
                    <div className="
                        rounded-[5px] 
                        flex justify-center items-center 
                        bg-white p-2 
                        border-2 border-black
                        w-full h-full flex-grow relative">
                        <div className="flex flex-col justify-between items-center h-full w-full">
                            <img src={updatedProduct ? updatedProduct.imageUrl : photos ? photos[currentPhotoIndex].imageUrl : src} alt={updatedProduct ? updatedProduct.title : photos ? photos[currentPhotoIndex].title : alt} className="rounded-sm object-cover flex-grow w-full min-h-[40vh]" />
                            {name && <h2 className="text-[1.5rem] text-center bg-white p-2  w-full" >{updatedProduct ? updatedProduct.title : name}</h2>}
                            {u && <AdminButtons handleEdit={handleEdit} />}
                            {isInventory && photos && <ShoppingButtons product={updatedProduct ?? photos[0]} handleDetails={handleClickProductDetails ? () => handleClickProductDetails(arrayIndex ?? 0) : () => {}} />}
                        </div>
                    </div>
                </div>
    )
}
