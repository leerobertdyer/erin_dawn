import { User } from "firebase/auth";
import { useState } from "react";
import ProductForm, { IProductToEdit } from "../ProductForm/ProductForm";
import { getPhoto } from "../../firebase/getPhotos";
import removeProduct from "../../firebase/removeProduct";
import removeFile from "../../firebase/removeFile";

interface IFrameProps {
    src: string;
    alt: string;
    name?: string;
    size?: string;
    hover?: boolean;
    u: User | null;
    id: string
    onDelete?: (id: string) => void;
}

interface IUpdatedProduct {
    title: string;
    src: string;
}
export default function Frame({ src, alt, name, size, hover, u, id, onDelete }: IFrameProps) {
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

    function calculateSize(sizeMap: string) {
        if (sizeMap.split(" ").length === 1) return { default: sizeMap, md: sizeMap, lg: sizeMap };
        else {
            return {
                default: sizeMap.split(" ")[0],
                md: sizeMap.split(" ")[1],
                lg: sizeMap.split(" ")[2]
            }
        }
    }

    return (
        (isEditing && product)
            ?
            <div className="w-screen h-screen bg-white fixed top-0 left-0 z-50 flex justify-center items-center">
                <ProductForm product={product} />
            </div>
            :
            <div className={`${hover && "cursor-pointer transition-all duration-1000 hover:[transform:rotateY(180deg)]"}
            ${size && calculateSize(size).default}
        ${size && calculateSize(size).md} ${size && calculateSize(size).lg}`}>
                <div
                    className="
            rounded-[5px] 
            flex justify-center items-center 
            bg-white p-2 
            border-2 border-black
            w-[100%] flex-grow">
                    <div className="flex flex-col justify-between items-center h-full w-full">
                        <img src={updatedProduct ? updatedProduct.src : src} alt={updatedProduct ? updatedProduct.title : alt} className="rounded-sm object-cover flex-grow w-full min-h-[40vh]" />
                        {name && <h2 className="text-[1.5rem] text-center bg-white p-2  w-full" >"{name}"</h2>}
                        {u && <div className="flex justify-center items-center w-full p-2 gap-4">
                            <button
                                className="
                            transition:all duration-[10ms]
                            hover:bg-yellow-500 hover:text-black
                            bg-green-500 text-white px-2 rounded-md w-[100%]" onClick={handleEdit}>Edit</button>
                        </div>}
                    </div>
                </div>
            </div>
    )
}
