import { IProductInfo } from "../../Interfaces/IProduct";
import Frame from "../Frame/Frame";
import AdminButtons from "../Buttons/AdminButtons";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { useState, useCallback, useRef, useEffect } from "react";
import WarningDialogue from "../WarningDialogue/WarningDialogue";
import { editProductDoc } from "../../firebase/editDoc";
import { IGeneralPhoto } from "../../Interfaces/IPhotos";
import getProductPhotosToUpload from "../../util/getProductPhotosToUpload";
import { NEW_PRODUCT_DEFAULT_HEIGHT, NEW_PRODUCT_DEFAULT_WIDTH } from "../../util/constants";
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
    const [files, setFiles] = useState<File[] | null | undefined>();
    const [background, setBackground] = useState<string>("");
    const [percent, setPercent] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [draggedPhoto, setDraggedPhoto] = useState<IGeneralPhoto | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [isUpdatedPhotoState, setIsUpdatedPhotoState] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);

    // Track current state of photos including deletions and reordering
    const [currentPhotos, setCurrentPhotos] = useState<IGeneralPhoto[]>(product.photos);

    useEffect(() => {
        // Update currentPhotos when product.photos changes
        setCurrentPhotos(product.photos);
    }, [product.photos]);

    useEffect(() => {
        if (!isUpdatedPhotoState) {
            setCurrentPhotos(product.photos);
        }
    }, [product.photos, isUpdatedPhotoState]);

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

    const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragIn = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragOut = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        setDragOverIndex(null);
    }, []);

    const handlePhotoDragStart = (e: React.DragEvent<HTMLDivElement>, photo: IGeneralPhoto) => {
        console.log('Drag start:', photo.title, photo.id);
        e.stopPropagation();
        setDraggedPhoto(photo);
        // Store the dragged photo's ID in the dataTransfer
        e.dataTransfer.setData('text/plain', photo.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handlePhotoDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        console.log('Drag end');
        e.stopPropagation();
        setDragOverIndex(null);
        setDraggedPhoto(null);
    };

    const handlePhotoDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Only update if we're dragging over a new target
        if (dragOverIndex !== index) {
            console.log('Dragging over index:', index);
            setDragOverIndex(index);
        }
    };

    const handlePhotoDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverIndex(null);
    };

    const handlePhotoDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
        e.preventDefault();
        e.stopPropagation();
        
        const draggedPhotoId = e.dataTransfer.getData('text/plain');
        if (!draggedPhotoId) return;

        const draggedIndex = currentPhotos.findIndex(p => p.id === draggedPhotoId);
        if (draggedIndex === -1 || draggedIndex === targetIndex) return;

        // Simple array manipulation
        const newPhotos = [...currentPhotos];
        const [photoToMove] = newPhotos.splice(draggedIndex, 1);
        newPhotos.splice(targetIndex, 0, photoToMove);

        // Update orders
        const photosWithNewOrder = newPhotos.map((photo, idx) => ({
            ...photo,
            order: idx + 1
        }));

        // Update local state immediately
        setCurrentPhotos(photosWithNewOrder);
        
        // Update parent state to ensure UI consistency
        setAllProducts(allProducts.map(p =>
            p.id === product.id
                ? { ...p, photos: photosWithNewOrder }
                : p
        ));

        // Reset drag states
        setDragOverIndex(null);
        setDraggedPhoto(null);
        setIsUpdatedPhotoState(true);
    };

    const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            setFiles(droppedFiles);
            if (droppedFiles[0]) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setBackground(reader.result as string);
                };
                reader.readAsDataURL(droppedFiles[0]);
            }
        }
    }, []);

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    async function handleSendPhotosToForm() {
        try {
            if (!files) return;
            
            const filesToUpload = await getProductPhotosToUpload(files, product.title, (product.photos[0]?.tags || ["edc", "inventory"]), NEW_PRODUCT_DEFAULT_WIDTH, NEW_PRODUCT_DEFAULT_HEIGHT, onProgress)

            // Sort current photos by order and ensure no gaps in order numbers
            const normalizedCurrentPhotos = normalizePhotoOrders(currentPhotos);

            // Add new photos with incremented orders
            const newPhotosWithOrder = filesToUpload.map((photo, idx) => ({
                ...photo,
                order: normalizedCurrentPhotos.length + idx + 1
            }));

            const prevPlusNewPhotos = [...normalizedCurrentPhotos, ...newPhotosWithOrder];

            // Update the database first
            await editProductDoc({
                ...product,
                photos: prevPlusNewPhotos
            });

            // Then update the UI state
            setAllProducts(allProducts.map(p =>
                p.id === product.id
                    ? { ...p, photos: prevPlusNewPhotos }
                    : p
            ));
            onSave(prevPlusNewPhotos);
            
            // Clean up state
            setFiles(undefined);
            setBackground("");
            setIsUpdatedPhotoState(false);
            setPercent(0);
        } catch (error) {
            console.error('Error uploading photos:', error);
            // You might want to add error UI feedback here
        }
    }

    async function handleSaveReorderedPhotos() {
        try {
            // Update the database
            await editProductDoc({
                ...product,
                photos: currentPhotos
            });

            // Update UI state
            setAllProducts(allProducts.map(p =>
                p.id === product.id
                    ? { ...p, photos: currentPhotos }
                    : p
            ));
            onSave(currentPhotos);
            setIsUpdatedPhotoState(false);
        } catch (error) {
            console.error('Error saving reordered photos:', error);
            // You might want to add error UI feedback here
        }
    }

    function onClickDelete(photo: IGeneralPhoto) {
        setCurrentPhoto(photo);
        setIsDeleting(true);
    }

    async function onFinalDelete(photo: IGeneralPhoto) {
        try {
            const updatedPhotos = currentPhotos
                .filter(p => p.id !== photo.id)
                .sort((a, b) => (a.order || 0) - (b.order || 0));

            // Update database with single call
            await editProductDoc({
                ...product,
                photos: updatedPhotos
            });

            // Update UI state
            setCurrentPhotos(updatedPhotos);
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
                <button onClick={handleBack}
                    className="w-[10rem] mx-auto my-[1rem] bg-edcPurple-60 text-white p-2 rounded-md">Back</button>
            </div>
            <div className="flex flex-col flex-wrap md:flex-row justify-center items-center gap-[1rem] w-full h-fit mb-8">
                {currentPhotos.map((photo, index) => (
                    <div
                        key={photo.id}
                        draggable={true}
                        onDragStart={(e) => handlePhotoDragStart(e, photo)}
                        onDragEnd={handlePhotoDragEnd}
                        onDragOver={(e) => handlePhotoDragOver(e, index)}
                        onDragLeave={handlePhotoDragLeave}
                        onDrop={(e) => handlePhotoDrop(e, index)}
                        data-photo-id={photo.id}
                        className={`transition-all cursor-move relative ${
                            dragOverIndex === index && draggedPhoto?.id !== photo.id 
                                ? 'scale-105 border-2 border-edcPurple-60 bg-edcPurple-10' 
                                : draggedPhoto?.id === photo.id 
                                ? 'opacity-40'
                                : ''
                        }`}
                    >
                        <Frame additionalClass="w-[15rem] h-[24rem]">
                            <img 
                                src={photo.url} 
                                id={photo.id} 
                                className="rounded-md object-cover w-full h-full select-none"
                                draggable={false}
                                alt={photo.title || 'Product photo'}
                            />
                            <AdminButtons 
                                onDelete={() => onClickDelete(photo)} 
                                handleEdit={() => handleEditProduct(product)} 
                            />
                        </Frame>
                    </div>
                ))}
            </div>

            {/* Drag and drop zone */}
            <div
                ref={dropZoneRef}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleFileSelect}
                className={`w-full max-w-[20rem] h-[12rem] m-auto mt-[2rem] border-2 border-dashed rounded-lg flex flex-col justify-center items-center cursor-pointer transition-all ${isDragging ? 'border-edcPurple-60 bg-edcPurple-10' : 'border-gray-300'}`}
            >
                <IoIosCamera className="text-4xl mb-2 text-edcPurple-60" />
                <p className="text-center text-gray-600">
                    Drag & drop photos here<br />
                    or click to select
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={(e) => {
                        const fileList = e.target.files;
                        if (fileList) {
                            setFiles(Array.from(fileList));
                            if (fileList[0]) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    setBackground(reader.result as string);
                                };
                                reader.readAsDataURL(fileList[0]);
                            }
                        }
                    }}
                    className="hidden"
                />
            </div>

            {(files || isUpdatedPhotoState) && <button
                className="w-[10rem] m-auto bg-edcPurple-60 p-2 text-white rounded-md text-center cursor-pointer flex justify-center items-center gap-4 border-2 border-edcPurple-60 py-4 my-4"
                onClick={() => files ? handleSendPhotosToForm() : handleSaveReorderedPhotos()}>
                {files ? 'Upload' : 'Save Changes'}
            </button>}
        </div>
    )
}