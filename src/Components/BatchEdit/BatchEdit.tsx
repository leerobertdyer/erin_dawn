import { IProductInfo } from "../../Interfaces/IProduct";
import Frame from "../Frame/Frame";
import AdminButtons from "../Buttons/AdminButtons";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { useState } from "react";
import WarningDialogue from "../WarningDialogue/WarningDialogue";
import { usePhotosContext } from "../../Context/PhotosContext";

interface IBatchEdit {
    products: IProductInfo[];
    handleBack: () => void;
}
export default function BatchEdit({ products, handleBack }: IBatchEdit) {
    const { handleEdit, setIsBatchEdit } = useProductManagementContext();
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<IProductInfo | null>(null);
    
    const { allPhotos, handleSetAllPhotos } = usePhotosContext();
    const { handleDelete } = useProductManagementContext();

    function onClickDelete(product: IProductInfo) {
        setCurrentProduct(product);
        setIsDeleting(true);
    }

    function onFinalDelete(product: IProductInfo) {
        if (product.itemOrder === 1) {
            const itemName = product.itemName;
            const itemPhotos = allPhotos.filter((photo) => photo.itemName === itemName);
            console.log('deleteing all photos in series', itemPhotos);
            itemPhotos.forEach(async (photo) => {
                 handleDelete(photo.imageUrl, photo.id);
            });
        handleSetAllPhotos(allPhotos.filter((photo) => photo.itemName !== product.itemName))
        
        } else{
            handleSetAllPhotos(allPhotos.filter((photo) => photo.id !== product.id))
            handleDelete(product.imageUrl, product.id);
        }
        setIsDeleting(false);
        setIsBatchEdit(false);
    }

    if (isDeleting ) return (
        <WarningDialogue
        onYes={() => onFinalDelete(currentProduct!)}
        closeDialogue={() => setIsDeleting(false)}
        message={currentProduct?.itemOrder === 1 
            ? "This is the main photo deleting this will delete all photos in the series. Is that ok?" 
            : "This will remove this photo from your series. Is that ok?"}        />
    )

    return (
        <div className="fixed top-0 left-0 z-10 w-screen min-h-full py-[2rem] bg-white flex flex-col items-center">
            <div className="flex flex-col md:flex-row justify-center items-center gap-[1rem] w-full">
                {products.map((product) =>
                    <Frame key={product.id} additionalClass="w-[15rem]">
                        <img src={product.imageUrl} id={product.id} className="rounded-md"/>
                        {product.itemOrder === 1
                        ? <AdminButtons  onDelete={() => onClickDelete(product)}/>
                        : <AdminButtons removePhotoFromSeries={() => onClickDelete(product)} handleEdit={() => handleEdit(product.id)} />
                        }
                    </Frame>
                )}
            </div>
            <button onClick={handleBack} className="w-[10rem] m-auto bg-white text-black p-2 rounded-md">Back</button>
        </div>
    )
}