import { IProductInfo } from "../../Interfaces/IProduct";
import Frame from "../Frame/Frame";
import AdminButtons from "../Buttons/AdminButtons";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { useState } from "react";
import WarningDialogue from "../WarningDialogue/WarningDialogue";
import { usePhotosContext } from "../../Context/PhotosContext";
import editDoc from "../../firebase/editDoc";

interface IBatchEdit {
    products: IProductInfo[];
    handleBack: () => void;
}
export default function BatchEdit({ products, handleBack }: IBatchEdit) {
    const { handleEdit, setIsBatchEdit } = useProductManagementContext();
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<IProductInfo | null>(null);
    const [isSettingKey, setIsSettingKey] = useState(false);

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

        } else {
            handleSetAllPhotos(allPhotos.filter((photo) => photo.id !== product.id))
            handleDelete(product.imageUrl, product.id);
        }
        setIsDeleting(false);
        setIsBatchEdit(false);
    }

    function onKeyChange() {
        setIsSettingKey(true);
    }

    function handleEditBothDocs(product: IProductInfo, otherProduct: IProductInfo, otherIndex: number) {
        editDoc({
            ...product,
            size: product.size,
            itemOrder: otherIndex
        })
        editDoc({
            ...otherProduct,
            size: otherProduct.size,
            itemOrder: product.itemOrder
        })
        handleSetAllPhotos(allPhotos.map((photo) => {
          return photo.id === product.id 
                ? {...photo, itemOrder: otherIndex} 
                    : photo.id === otherProduct.id 
                    ? {...photo, itemOrder: product.itemOrder} 
                    : photo}));
        }

    function moveProductLeft(product: IProductInfo) {
        const prevIndex = product.itemOrder - 1;
        const prevProduct = products.find((product) => product.itemOrder === prevIndex);
        if (!prevProduct) return;
        handleEditBothDocs(product, prevProduct, prevIndex);
    }

    function moveProductRight(product: IProductInfo) {
        const index = product.itemOrder + 1;
        const nextProduct = products.find((product) => product.itemOrder === index);
        if (!nextProduct) return;
        handleEditBothDocs(product, nextProduct, index);
    }

    function handleFinishKey() {
        setIsSettingKey(false);
        setIsBatchEdit(false);
    }
    if (isDeleting) return (
        <WarningDialogue
            onYes={() => onFinalDelete(currentProduct!)}
            closeDialogue={() => setIsDeleting(false)}
            message={currentProduct?.itemOrder === 1
                ? "This is the main photo deleting this will delete all photos in the series. Is that ok?"
                : "This will remove this photo from your series. Is that ok?"} />
    )

    return (
        <div className="fixed top-0 left-0 z-10 w-screen min-h-full py-[2rem] bg-white flex flex-col items-center">
            <div className="flex flex-col md:flex-row justify-center items-center gap-[1rem] w-full">
                {products.map((product) =>
                    <Frame key={product.id} additionalClass="w-[15rem] ">
                        <img src={product.imageUrl} id={product.id} className="rounded-md" />
                        {isSettingKey
                            ? product.itemOrder === 1
                                ? <AdminButtons moveProductRight={() => moveProductRight(product)} />
                                : product.itemOrder === products.length - 1
                                    ? <AdminButtons moveProductLeft={() => moveProductLeft(product)} moveProductRight={() => moveProductRight(product)} />
                                    : <AdminButtons moveProductLeft={() => moveProductLeft(product)}  />

                            : product.itemOrder === 1
                                ? <AdminButtons onKeyChange={() => onKeyChange()} onDelete={() => onClickDelete(product)} handleEdit={() => handleEdit(product.id)}/>
                                : <AdminButtons removePhotoFromSeries={() => onClickDelete(product)} handleEdit={() => handleEdit(product.id)} />
                        }
                    </Frame>
                )}
            </div>
            <button onClick={isSettingKey ? () => handleFinishKey() : handleBack}
                className="w-[10rem] m-auto bg-edcPurple-60 text-white  p-2 rounded-md">{isSettingKey ? "Done" : "Back"}</button>
        </div>
    )
}