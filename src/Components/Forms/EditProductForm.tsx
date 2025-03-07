import { useEffect, useState } from "react";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { handleFileChange, preventEnterFromSubmitting } from "./formUtil";
import { IoIosCamera, } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import MainFormTemplate from "./MainFormTemplate";
import CustomInput from "../CustomInput/CustomInput";
import WarningDialogue from "../WarningDialogue/WarningDialogue";
import { IProductInfo } from "../../Interfaces/IProduct";
import { usePhotosContext } from "../../Context/PhotosContext";
import { editDoc } from "../../firebase/editDoc";
import editFile from "../../firebase/editfile";
import { resizeFile } from "../../util/resizeFile";
import { BACKEND_URL, NEW_PRODUCT_DEFAULT_HEIGHT, NEW_PRODUCT_DEFAULT_WIDTH, NEW_PRODUCT_IMAGE_QUALITY } from "../../util/constants";

export default function EditProductForm() {
    const { product, isEditing, setIsEditing, handleDelete, previousUrl, handleBack } = useProductManagementContext();
    const { allPhotos, setAllPhotos } = usePhotosContext();

    const navigate = useNavigate();
    const [title, setTitle] = useState(product?.title ?? "");
    const [description, setDescription] = useState(product?.description ?? "");
    const [price, setPrice] = useState(product?.price ?? 0.00);
    const [size, setSize] = useState(product?.size ?? "");
    const [dimensions, setDimensions] = useState(product?.dimensions ?? "");
    const [file, setFile] = useState<File | null>(null);
    const [background, setBackground] = useState(product?.imageUrl ?? "");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isEditing) navigate(previousUrl);
    }, [isEditing])

    async function editStripeProduct() {
        const stripeProduct = {
            stripeProductId: product?.stripeProductId,
            name: title,
            description: description,
            newPrice: price,
        }
        const editProductEndpoint = `${BACKEND_URL}/edit-product`
        console.log("sending fetch to : ", editProductEndpoint)
        const resp = await fetch(editProductEndpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stripeProduct)
        }); if (resp.ok) {
            console.log("Product edited successfully")
            const { stripeProductId, stripePriceId } = await resp.json()
            return { stripeProductId, stripePriceId }
        } else {
            console.log("Error editing Stripe Product/Price: ", resp)
            throw new Error("Error editing stripe product and price")
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        if (!product) {
            setIsSubmitting(false);
            return;
        }
        let downloadUrl = "";

        const { stripeProductId, stripePriceId } = await editStripeProduct()
        const nextPhotos = [];
        if (file) { // if file is present, edit the file then update doc for that specific photo
            const resizedFile = await resizeFile(file, {
                maxWidth: NEW_PRODUCT_DEFAULT_WIDTH,
                maxHeight: NEW_PRODUCT_DEFAULT_HEIGHT,
                maintainAspectRatio: true,
                quality: NEW_PRODUCT_IMAGE_QUALITY
            });
            downloadUrl = await editFile({
                file: resizedFile,
                id: product.id,
                url: product.imageUrl,
                title,
                description,
                price,
                size,
                dimensions,
                tags: product.tags,
                category: product.category,
                series: product.series,
                itemOrder: product.itemOrder,
                itemName: product.itemName,
                stripeProductId,
                stripePriceId
            });
            nextPhotos.push({
                id: product.id,
                imageUrl: downloadUrl,
                title,
                description,
                price,
                size,
                dimensions,
                tags: product.tags,
                category: product.category,
                series: product.series,
                itemOrder: product.itemOrder,
                itemName: product.itemName,
                stripeProductId,
                stripePriceId
            });
        }
        const allPhotosWithItemName = allPhotos.filter((photo) => photo.itemName === product.itemName);
        console.log("All photos with item name: ", allPhotosWithItemName)
        for (const photo of allPhotosWithItemName) { // this loops over the whole series.
            if (photo.id === product.id && file) continue; // skip the photo that was just edited
            // if file is not present, update metadata only
            const newPhoto = {
                id: photo.id,
                imageUrl: photo.imageUrl,
                title,
                description,
                price,
                size,
                dimensions,
                tags: photo.tags,
                series: photo.series,
                category: photo.category,
                itemOrder: photo.itemOrder,
                itemName: photo.itemName,
                stripeProductId,
                stripePriceId
            }
            await editDoc(newPhoto);
            nextPhotos.push(newPhoto);
        }

        const nextAllPhotos = allPhotos.map((photo) => {
            const editedPhoto = nextPhotos.find((ePhoto) => ePhoto.id === photo.id);
            if (editedPhoto) {
                console.log('FOUND PHOTO IN ALLPHOTO STAT UPDATE: ', editedPhoto.title)
                return editedPhoto;
            }
            return photo;
        })
        console.log("Allphotos After editing:", nextAllPhotos)
        setAllPhotos(nextAllPhotos);

        setIsEditing(false);

        navigate('/shop');
    }

    function resetState() {
        setTitle(product?.title ?? "")
        setDescription(product?.description ?? "")
        setPrice(product?.price ?? 0.00)
        setFile(null);
        setBackground(product?.imageUrl ?? "");
    }

    function onClickDelete() {
        setIsDeleting(true);
    }

    function onFinalDelete(product: IProductInfo) {
        setAllPhotos(allPhotos.filter((photo) => photo.id !== product.id))
        handleDelete(product.imageUrl, product.id);
    }

    if (isDeleting && product) return <WarningDialogue closeDialogue={() => setIsDeleting(false)} onYes={() => onFinalDelete(product)} />

    if (product) return (

        <div className="flex flex-col justify-center items-center w-screen h-fit overflow-scroll">
            <h2 className="text-2xl p-2 rounded-md bg-white ">Edit Product</h2>

            <form onSubmit={handleSubmit} onKeyDown={preventEnterFromSubmitting}
                className="bg-white flex flex-col justify-center m-auto items-center w-[85vw] h-screen border-2 border-black rounded-md p-4 mt-4 gap-4"
                style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
               
                <MainFormTemplate product={product} handleClickBack={handleBack} resetState={resetState} handleDelete={onClickDelete}>
                    <CustomInput type="text" label="Product Name" placeholder="Product Name" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <CustomInput type="textarea" label="Product Description" placeholder="Product Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <CustomInput type="number" label="Product Price" placeholder="Product Price" value={price.toString()} onChange={(e) => setPrice(Number(Number((e.target.value)).toFixed(2)))} />
                        <select className="border-2 border-black rounded-md p-2 w-full" onChange={(e) => setSize(e.target.value)} value={size}>
                            <option value="" disabled>Select Size</option>
                            <option value="sm">Small</option>
                            <option value="md">Medium</option>
                            <option value="lg">Large</option>
                            <option value="xl">XL</option>
                            <option value="2xl">2XL</option>
                            <option value="3xl">3XL</option>
                        </select>
                    <CustomInput type="text" label="Dimensions" placeholder="Dimensions" value={dimensions} onChange={(e) => setDimensions(e.target.value)} />

                    <div className="flex flex-col gap-2">
                        <label htmlFor="file"
                            className="p-4 bg-green-500 text-white cursor-pointer rounded-md flex justify-center gap-4">Upload Image <IoIosCamera />
                        </label>
                        <input type="file" id="file" placeholder="Product Image"
                            className="hidden" onChange={(e) => handleFileChange(e, setFile, setBackground)} />
                        <p className="text-center w-full m-auto py-1 px-2 rounded-md text-xs text-gray-400 bg-white">{file ? file.name : "No File Selected"}</p>
                    </div>

                    <button type="submit"
                        disabled={isSubmitting}
                        className="
                        bg-edcPurple-60 text-white 
                        hover:bg-yellow-500 hover:text-edcPurple-60 
                        rounded-md p-2 w-full">
                        Submit</button>
                </MainFormTemplate>

            </form>
        </div>
    )
}
