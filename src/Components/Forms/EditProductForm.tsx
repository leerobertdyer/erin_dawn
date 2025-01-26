import { useEffect, useState } from "react";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { handleFileChange, preventEnterFromSubmitting } from "./formUtil";
import { IoIosCamera, } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import MainFormTemplate from "./MainFormTemplate";
import CustomInput from "../CustomInput/CustomInput";
import WarningDialogue from "../WarningDialogue/WarningDialogue";
import { usePhotos } from "../../Hooks/usePhotos";
import { IProductInfo } from "../../Interfaces/IProduct";
import { usePhotosContext } from "../../Context/PhotosContext";

export default function EditProductForm() {
    const { product, isEditing, handleEdit, handleDelete, previousUrl, handleBack } = useProductManagementContext();
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

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!product) return;

        handleEdit(product.id);
    }

    function resetState() {
        setTitle(product?.title ?? "")
        setDescription(product?.description ?? "")
        setPrice(product?.price ?? 0.00)
        setFile(null);
        setBackground(product?.imageUrl ?? "");
    }

    if (product?.seriesOrder && product.seriesOrder > 1) return (
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
                        className="p-2 rounded-md text-white bg-edcPurple-60 w-[15rem]">Submit</button>
                
                </MainFormTemplate>
                <div className="w-[100%] h-10 m-auto flex justify-center items-center gap-4">

                </div>

            </form>
        </div>
    )
}
