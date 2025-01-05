import { User } from "firebase/auth";
import { useState } from "react";
import ProductForm from "../ProductForm/ProductForm";
import { getPhoto } from "../../firebase/getPhotos";
import removeProduct from "../../firebase/removeProduct";
import removeFile from "../../firebase/removeFile";
import AdminButtons from "./AdminButtons";
import { IProductToEdit } from "../../Interfaces/IProduct";
import ShoppingButtons from "./ShoppingButtons";

interface IFrameProps {
    src: string;
    alt: string;
    name?: string;
    additionalClass?: string;
    hover?: boolean;
    u: User | null;
    id: string
    onDelete?: (id: string) => void;
    isInventory?: boolean;
}

interface IUpdatedProduct {
    title: string;
    src: string;
}
export default function Frame({ src, alt, name, additionalClass, hover, u, id, onDelete, isInventory }: IFrameProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [product, setProduct] = useState<IProductToEdit | null>(null);
    const [updatedProduct, setUpdatedProduct] = useState<IUpdatedProduct | null>(null);

    function updateProduct(newProduct: { title: string, src: string }) {
        console.log("Finalizing Edit")
        setUpdatedProduct(newProduct);
        setProduct(null);
        setIsEditing(false);
    }

    async function handleDelete(url: string) {
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
            onProductUpdate: updateProduct,
            onPruductDelete: handleDelete
        })
    }

    return (
        (isEditing && product)
            ?
            <div className="w-screen h-screen bg-white fixed top-0 left-0 z-50 flex justify-center items-center">
                <ProductForm product={product} />
            </div>
            :
            <div className={`${hover && "cursor-pointer transition-all duration-1000 hover:[transform:rotateY(180deg)]"}
            ${additionalClass && additionalClass} flex-col h-full w-full`}>
                <div
                    className="
            rounded-[5px] 
            flex justify-center items-center 
            bg-white p-2 
            border-2 border-black
            w-full h-full flex-grow">
                    <div className="flex flex-col justify-between items-center h-full w-full">
                        <img src={updatedProduct ? updatedProduct.src : src} alt={updatedProduct ? updatedProduct.title : alt} className="rounded-sm object-cover flex-grow w-full min-h-[40vh]" />
                        {name && <h2 className="text-[1.5rem] text-center bg-white p-2  w-full" >"{name}"</h2>}
                        {u && <AdminButtons handleEdit={handleEdit} />}
                        {isInventory && <ShoppingButtons />}
                    </div>
                </div>
            </div>
    )
}
