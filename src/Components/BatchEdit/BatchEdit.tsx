import { IProductInfo } from "../../Interfaces/IProduct";
import Frame from "../Frame/Frame";
import AdminButtons from "../Buttons/AdminButtons";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { useState } from "react";
import WarningDialogue from "../WarningDialogue/WarningDialogue";
import { usePhotosContext } from "../../Context/PhotosContext";
import { editDoc } from "../../firebase/editDoc";

interface IBatchEdit {
    products: IProductInfo[];
    handleBack: () => void;
}
export default function BatchEdit({ products, handleBack }: IBatchEdit) {
    const { handleEdit, setIsBatchEdit } = useProductManagementContext();
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<IProductInfo | null>(null);
    const [isSettingKey, setIsSettingKey] = useState(false);

    const { allPhotos, setAllPhotos } = usePhotosContext();
    const { handleDelete } = useProductManagementContext();

    function onClickDelete(product: IProductInfo) {
        setCurrentProduct(product);
        setIsDeleting(true);
    }

    async function onFinalDelete(product: IProductInfo) {
        try {
            if (product.itemOrder === 1) {
                const itemName = product.itemName;
                const itemPhotos = allPhotos.filter((photo) => photo.itemName === itemName);
                console.log('deleteing all photos in series', itemPhotos);
                await Promise.all(itemPhotos.map(photo => 
                    handleDelete(photo.imageUrl, photo.id)
                ));
                setAllPhotos(allPhotos.filter((photo) => photo.itemName !== product.itemName))
    
            } else {
                 handleDelete(product.imageUrl, product.id);
                setAllPhotos(allPhotos.filter((photo) => photo.id !== product.id))
            }
            setIsDeleting(false);
            setIsBatchEdit(false);
        } catch (error) {
            console.error(`Error during onFinalDelete in BatchEdit: ${error}`);
        }
    }

    function onKeyChange() {
        setIsSettingKey(true);
    }

    async function handleEditBothDocs(product: IProductInfo, otherProduct: IProductInfo, otherIndex: number) {
        try {
            await Promise.all([
                editDoc({
                    ...product,
                    size: product.size,
                    itemOrder: otherIndex
                }),
                editDoc({
                    ...otherProduct,
                    size: otherProduct.size,
                    itemOrder: product.itemOrder
                })
            ])
        } catch (error) {
            console.error(`Error editing both docs in BatchEdit: ${error}`)
        }
        setAllPhotos(allPhotos.map((photo) => {
          return photo.id === product.id 
                ? {...photo, itemOrder: otherIndex} 
                    : photo.id === otherProduct.id 
                    ? {...photo, itemOrder: product.itemOrder} 
                    : photo}));
        }

    async function moveProductLeft(product: IProductInfo) {
        if (!product?.itemOrder || product.itemOrder <= 1) return;
        const prevIndex = product.itemOrder - 1;
        const prevProduct = products.find((p) => p.itemOrder === prevIndex);
        if (!prevProduct) return;
        await handleEditBothDocs(product, prevProduct, prevIndex);
    }

    async function moveProductRight(product: IProductInfo) {
        if (!product?.itemOrder || product.itemOrder >= products.length) return;
        const index = product.itemOrder + 1;
        const nextProduct = products.find((p) => p.itemOrder === index);
        if (!nextProduct) return;
        await handleEditBothDocs(product, nextProduct, index);
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
        <div className="fixed top-0 left-0 z-10 w-screen h-screen py-[4rem] overflow-auto bg-white flex flex-col items-center relative">
            <div className="flex flex-col md:flex-row justify-center items-center gap-[1rem] w-full h-fit">
                {products.map((product) =>
                    <Frame key={product.id} additionalClass="w-[15rem] h-[24rem]">
                        <img src={product.imageUrl} id={product.id} className="rounded-md object-cover w-full h-full " />
                        {isSettingKey
                            ? product.itemOrder === 1
                                ? <AdminButtons moveProductRight={() => moveProductRight(product)} />
                                : product.itemOrder < products.length 
                                    ? <AdminButtons moveProductLeft={() => moveProductLeft(product)} moveProductRight={() => moveProductRight(product)} />
                                    : <AdminButtons moveProductLeft={() => moveProductLeft(product)}  />

                            : product.itemOrder === 1
                                ? <AdminButtons onKeyChange={() => onKeyChange()} onDelete={() => onClickDelete(product)} handleEdit={() => handleEdit(product.id)}/>
                                : <AdminButtons removePhotoFromSeries={() => onClickDelete(product)} handleEdit={() => handleEdit(product.id)} />
                        }
                    </Frame>
                )}
            </div>
            <div className="fixed top-0 w-full flex justify-center items-start bg-white h-[5rem]">
            <button onClick={isSettingKey ? () => handleFinishKey() : handleBack}
                className="w-[10rem] mx-auto my-[1rem] bg-edcPurple-60 text-white  p-2 rounded-md ">{isSettingKey ? "Done" : "Back"}</button>
                </div>
        </div>
    )
}