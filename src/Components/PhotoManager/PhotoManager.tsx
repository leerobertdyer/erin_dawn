import { IProductInfo } from "../../Interfaces/IProduct";
import Frame from "../Frame/Frame";
import AdminButtons from "../Buttons/AdminButtons";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { useState } from "react";
import WarningDialogue from "../WarningDialogue/WarningDialogue";
import { editProductDoc } from "../../firebase/editDoc";
import { IGeneralPhoto } from "../../Interfaces/IPhotos";
import getProductPhotosToUpload from "../../util/getProductPhotosToUpload";
import { NEW_PRODUCT_DEFAULT_HEIGHT, NEW_PRODUCT_DEFAULT_WIDTH } from "../../util/constants";
import { handleMultipleFileChange } from "../Forms/formUtil";
import { IoIosCamera } from "react-icons/io";
import LoadingBar from "../LoadingBar/LoadingBar";

interface IPhotoManager {
    product: IProductInfo;
    handleBack: () => void;
    onSave: (photos: IGeneralPhoto[]) => void
}
export default function PhotoManager({ product, handleBack, onSave }: IPhotoManager) {
    const { handleEditProduct, allProducts, setAllProducts } = useProductManagementContext();
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentPhoto, setCurrentPhoto] = useState<IGeneralPhoto | null>(null);
    const [isSettingKey, setIsSettingKey] = useState(false);
    const [files, setFiles] = useState<File[] | null | undefined>();
    const [background, setBackground] = useState<string>("");
    const [percent, setPercent] = useState(0);

    // Track current state of photos including deletions and reordering
    const [currentPhotos, setCurrentPhotos] = useState<IGeneralPhoto[]>(product.photos);

    const { handleDeletePhoto } = useProductManagementContext();

    function onProgress(progress: number) {
        setPercent(progress);
    }

        // Helper function to normalize photo orders
        function normalizePhotoOrders(photos: IGeneralPhoto[]): IGeneralPhoto[] {
            return photos
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((photo, index) => ({
                    ...photo,
                    order: index + 1
                }));
        }
    

    async function handleSendPhotosToForm() {
        const filesToUpload = await getProductPhotosToUpload(files, product.title, (product.photos[0]?.tags || ["edc", "inventory"]), NEW_PRODUCT_DEFAULT_WIDTH, NEW_PRODUCT_DEFAULT_HEIGHT, onProgress)

        // Sort current photos by order and ensure no gaps in order numbers
        const normalizedCurrentPhotos = normalizePhotoOrders(currentPhotos);

        // Add new photos with incremented orders
        const newPhotosWithOrder = filesToUpload.map((photo, idx) => ({
            ...photo,
            order: normalizedCurrentPhotos.length + idx + 1
        }));

        const prevPlusNewPhotos = [...normalizedCurrentPhotos, ...newPhotosWithOrder];

        setAllProducts(allProducts.map(p =>
            p.id === product.id
                ? { ...p, photos: prevPlusNewPhotos }
                : p
        ));
        onSave(prevPlusNewPhotos);
    }

    function onClickDelete(photo: IGeneralPhoto) {
        setCurrentPhoto(photo);
        setIsDeleting(true);
    }

    async function onFinalDelete(photo: IGeneralPhoto) {
        try {
            setCurrentPhotos(prev => prev.filter(p => p.id !== photo.id).sort((a, b) => (a.order || 0) - (b.order || 0)));
            setIsDeleting(false);
            if (photo.order === 1) {
                setAllProducts(allProducts.map(p => p.id === product.id ? { ...p, photos: p.photos.filter((ph: IGeneralPhoto) => ph.id !== photo.id) } : p))
                await Promise.all(product.photos.map(photo =>
                    handleDeletePhoto(product, photo)
                ));

            } else {
                setAllProducts(allProducts.map(p => p.id === product.id ? { ...p, photos: p.photos.filter((ph: IGeneralPhoto) => ph.id !== photo.id) } : p))
                handleDeletePhoto(product, photo);
            }
        } catch (error) {
            console.error(`Error during onFinalDelete in BatchEdit: ${error}`);
        }
    }

    function onKeyChange() {
        setIsSettingKey(true);
    }

    async function handleUpdateDoc(photoA: IGeneralPhoto, photoB: IGeneralPhoto) {
        // Swaps the orders in the database and update the UI

        const nextPhotos = product.photos.map((photo) => {
            return photo.id === photoB.id
                ? { ...photo, order: photoA.order }
                : photo.id === photoA.id
                    ? { ...photo, order: photoB.order }
                    : photo
        })
        setAllProducts(allProducts.map((p) => {
            return p.id === product.id
                ? { ...p, photos: nextPhotos }
                : p
        }));
        setCurrentPhotos(normalizePhotoOrders(nextPhotos));
        await editProductDoc({
            ...product,
            photos: nextPhotos
        })
    }

    async function moveProductLeft(photo: IGeneralPhoto) {
        if (!photo.order || photo.order <= 1) return;
        const prevIndex = photo.order - 1;
        const prevPhoto = product.photos.find((p) => p.order === prevIndex);
        if (!prevPhoto) return;
        await handleUpdateDoc(photo, prevPhoto);
    }

    async function moveProductRight(photo: IGeneralPhoto) {
        if (!photo.order || photo.order >= product.photos.length) return;
        const index = photo.order + 1;
        const nextPhoto = product.photos.find((p) => p.order === index);
        if (!nextPhoto) return;
        await handleUpdateDoc(photo, nextPhoto);
    }

    function handleFinishKey() {
        setIsSettingKey(false);
    }

    if (isDeleting) return (
        <WarningDialogue
            onYes={() => onFinalDelete(currentPhoto!)}
            closeDialogue={() => setIsDeleting(false)}
            message={currentPhoto?.order === 1
                ? "This is the main photo deleting this will delete all photos in the series. Is that ok?"
                : "This will remove this photo from your series. Is that ok?"} />
    )

    return (
        <div className={`top-0 left-0 z-10 w-screen h-screen py-[4rem] overflow-auto bg-white flex flex-col items-center relative pt-[7rem]`}
            style={{
                backgroundImage: `url('${background}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}>
            {percent > 0 && <div className="w-full flex justify-center items-center absolute bottom-0">
                <LoadingBar progress={percent} />
            </div>}
            <div className="fixed top-0 w-full flex justify-center items-start bg-white h-[6.5rem]">
                <button onClick={isSettingKey ? () => handleFinishKey() : handleBack}
                    className="w-[10rem] mx-auto my-[1rem] bg-edcPurple-60 text-white  p-2 rounded-md ">{isSettingKey ? "Done" : "Back"}</button>
            </div>
            <div className="flex flex-col flex-wrap md:flex-row justify-center items-center gap-[1rem] w-full h-fit">
                {currentPhotos.map((photo) =>
                    <Frame key={photo.id} additionalClass="w-[15rem] h-[24rem]">
                        <img src={photo.url} id={photo.id} className="rounded-md object-cover w-full h-full " />
                        {isSettingKey
                            ? photo.order === 1
                                ? <AdminButtons moveProductRight={() => moveProductRight(photo)} />
                                : photo.order < product.photos.length
                                    ? <AdminButtons moveProductLeft={() => moveProductLeft(photo)} moveProductRight={() => moveProductRight(photo)} />
                                    : <AdminButtons moveProductLeft={() => moveProductLeft(photo)} />

                            : photo.order === 1
                                ? <AdminButtons onKeyChange={() => onKeyChange()} onDelete={() => onClickDelete(photo)} handleEdit={() => handleEditProduct(product)} />
                                : <AdminButtons removePhotoFromSeries={() => onClickDelete(photo)} handleEdit={() => handleEditProduct(product)} />
                        }
                    </Frame>
                )}
            </div>

            {/* Input for adding new photos */}
            <label htmlFor="fileInput" className="w-[10rem] m-auto bg-gray-200 p-2 rounded-md text-center cursor-pointer flex justify-center items-center gap-4 border-2 border-edcPurple-60 py-4 my-4">Add Photos<IoIosCamera /></label>
            <input id="fileInput" hidden multiple onChange={(e) => handleMultipleFileChange(e, setFiles, setBackground)} type="file" required={true} />
            {files && <button
                className="w-[10rem] m-auto bg-edcPurple-60 p-2 text-white rounded-md text-center cursor-pointer flex justify-center items-center gap-4 border-2 border-edcPurple-60 py-4 my-4"
                onClick={() => handleSendPhotosToForm()}>Confirm</button>}
        </div>
    )
}