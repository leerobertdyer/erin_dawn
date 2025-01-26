import { useEffect, useState } from "react";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { usePhotosContext } from "../../Context/PhotosContext";
import { handleFileChange, preventEnterFromSubmitting } from "./formUtil";
import { IoIosCamera, } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import MainFormTemplate from "./MainFormTemplate";
import editFile  from "../../firebase/editfile";
import editDoc from "../../firebase/editDoc";

export default function EditHeroForm() {
    const { product, isEditing, handleEdit, previousUrl, handleBack } = useProductManagementContext();
    const { allPhotos, handleSetAllPhotos } = usePhotosContext();
    const navigate = useNavigate();

    const [file, setFile] = useState<File | null>();
    const [background, setBackground] = useState(product?.imageUrl ?? "");

    useEffect(() => {
        if (!isEditing) navigate(previousUrl);
    }, [isEditing])

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!product) return;

        const fileToEdit = {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            tags: product.tags,
            url: product.imageUrl,
            series: product.series,
            itemOrder: product.itemOrder,
            stripePriceId: product.stripePriceId,
            stripeProductId: product.stripeProductId,
            file: file as File,
            onProgress: (percent: number) => console.log(percent),  

        }

        const downloadUrl = await editFile(fileToEdit);
        console.log("Download URL: ", downloadUrl)
        
        if (!downloadUrl) return;

          await editDoc({
            ...product,
            imageUrl: downloadUrl,
            stripeProductId: "na",
            stripePriceId: "na",
        })

        const nextPhotos = handleSetAllPhotos(allPhotos.map(photo => {
            if (photo.id === product.id) {
                return {
                    ...photo,
                    imageUrl: downloadUrl,
                    stripeProductId: "na",
                    stripePriceId: "na",
                }
            }
            return photo
        }))

        navigate(previousUrl);
    }

    function resetState() {
        setFile(null);
        setBackground(product?.imageUrl ?? "");
    }


    if (product) return (

        <div className="flex flex-col justify-center items-center w-screen h-fit overflow-scroll">
            <h2 className="text-2xl p-2 rounded-md bg-white ">Change this photo on home Page</h2>

            <form onSubmit={handleSubmit} onKeyDown={preventEnterFromSubmitting}
                className="bg-white flex flex-col justify-center m-auto items-center w-[85vw] h-screen border-2 border-black rounded-md p-4 mt-4 gap-4"
                style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <MainFormTemplate product={product} handleClickBack={handleBack} resetState={resetState}>
                    <div className="flex flex-col gap-2">
                        <div className="bg-white bg-opacity-50 p-4 w-full h-full flex flex-col justify-center items-center">
                            This will swap out the picture in the exact place you selected it from.
                        </div>
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

            </form>
        </div>
    )
}
