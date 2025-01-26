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
import editDoc from "../../firebase/editDoc";
import editFile from "../../firebase/editfile";

export default function EditProductForm() {
    const { product, isEditing, handleDelete, previousUrl, handleBack } = useProductManagementContext();
    const { allPhotos, handleSetAllPhotos } = usePhotosContext();

    const navigate = useNavigate();
    const [title, setTitle] = useState(product?.title ?? "");
    const [description, setDescription] = useState(product?.description ?? "");
    const [price, setPrice] = useState(product?.price ?? 0.00);
    const [file, setFile] = useState<File | null>();
    const [background, setBackground] = useState(product?.imageUrl ?? "");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!isEditing) navigate(previousUrl);
    }, [isEditing])

    const BACKEND = import.meta.env.VITE_BACKEND_URL;

    async function editStripeProduct() {
        const stripeProduct = {
            stripeProductId: product?.stripeProductId,
            name: title,
            description: description,
            newPrice: price,
        }
        const editProductEndpoint = `${BACKEND}/edit-product`
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
        if (!product) return;
        let downloadUrl = "";

        const { stripeProductId, stripePriceId } = await editStripeProduct()

        const allPhotosWithItemName = allPhotos.filter((photo) => photo.itemName === product.itemName);
        allPhotosWithItemName.forEach(async (photo) => {

            if (file) { // if file is present, edit the file then update doc
                downloadUrl = await editFile({
                    file,
                    id: photo.id,
                    url: photo.imageUrl,
                    title,
                    description,
                    price,
                    tags: photo.tags,
                    series: photo.series,
                    itemOrder: photo.itemOrder,
                    stripeProductId,
                    stripePriceId
                });

                await editDoc({
                    id: photo.id,
                    title,
                    description,
                    tags: photo.tags,
                    price,
                    series: photo.series,
                    itemOrder: photo.itemOrder,
                    imageUrl: downloadUrl,
                    stripeProductId,
                    stripePriceId
                })
            } else { // if file is not present, update doc only
                await editDoc({
                    id: product.id,
                    title,
                    description,
                    tags: product.tags,
                    price,
                    series: product.series,
                    itemOrder: product.itemOrder,
                    imageUrl: product.imageUrl,
                    stripeProductId,
                    stripePriceId
                })
            }
        })
            navigate(previousUrl);
    }

    function resetState() {
        setTitle(product?.title ?? "")
        setDescription(product?.description ?? "")
        setPrice(product?.price ?? 0.00)
        setFile(null);
        setBackground(product?.imageUrl ?? "");
    }

    if (product?.itemOrder && product.itemOrder > 1) return (
        <div className="flex flex-col justify-center items-center w-screen h-fit overflow-scroll">
            <form onSubmit={handleSubmit} onKeyDown={preventEnterFromSubmitting}
                className="bg-white flex flex-col justify-center m-auto items-center w-[85vw] h-screen border-2 border-black rounded-md p-4 mt-4 gap-4"
                style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>


            </form>
        </div>
    )

    function onClickDelete() {
        setIsDeleting(true);
    }

    function onFinalDelete(product: IProductInfo) {
        handleSetAllPhotos(allPhotos.filter((photo) => photo.id !== product.id))
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

                    <CustomInput type="text" label="Product Description" placeholder="Product Description" value={description} onChange={(e) => setDescription(e.target.value)} />

                    <CustomInput type="number" label="Product Price" placeholder="Product Price" value={price.toString()} onChange={(e) => setPrice(Number(Number((e.target.value)).toFixed(0)))} />

                    <div className="flex flex-col gap-2">
                        <label htmlFor="file"
                            className="p-4 bg-green-500 text-white cursor-pointer rounded-md flex justify-center gap-4">Upload Image <IoIosCamera />
                        </label>
                        <input type="file" id="file" placeholder="Product Image"
                            className="hidden" onChange={(e) => handleFileChange(e, setFile, setBackground)} />
                        <p className="text-center w-full m-auto py-1 px-2 rounded-md text-xs text-gray-400 bg-white">{file ? file.name : "No File Selected"}</p>
                    </div>

                    <button type="submit" 
                    className="
                        bg-edcPurple-60 text-white 
                        hover:bg-yellow-500 hover:text-edcPurple-60 
                        rounded-md p-2 w-full">
                        Submit</button>

                </MainFormTemplate>
                <div className="w-[100%] h-10 m-auto flex justify-center items-center gap-4">

                </div>

            </form>
        </div>
    )
}
