import { useEffect, useState } from "react";
import { handleFileChange, preventEnterFromSubmitting } from "./formUtil";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { IoIosCamera } from "react-icons/io";
import MainFormTemplate from "./MainFormTemplate";
import uploadFile from "../../firebase/uploadFile";
import newDoc from "../../firebase/newDoc";
import LoadingBar from "../LoadingBar/LoadingBar";
import { usePhotos } from "../../Hooks/usePhotos";
import { useNavigate } from "react-router-dom";
import { usePhotosContext } from "../../Context/PhotosContext";

export default function NewSeriesPhotoForm() {
    const [background, setBackground] = useState("/images/background.jpg");
    const [file, setFile] = useState<File | null>();
    const [progress, setProgress] = useState(0);

    const { handleBack, product } = useProductManagementContext();
    const { allPhotos, handleSetAllPhotos } = usePhotosContext();

    const navigate = useNavigate();

    function onProgress(percent: number) {
        setProgress(percent)
    }

    useEffect(() => {
        if (!product) navigate("/shop")
            console.log(product)
    }, [])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!product) return;

        const nextIndex = allPhotos.filter(photo => photo.series === product.series).length + 1
        console.log("Current Series Length: ", nextIndex)

        const newTitle = `${product.title.replace(/ /g, "_")}${(nextIndex + 1).toString()}`
        console.log("New Title: ", newTitle)

        const fileToUpload = {
            reference: newTitle,
            file: file as File,
            onProgress: onProgress,
        }

        // Upload file to storage return download url
        const downloadUrl = await uploadFile(fileToUpload);
        console.log("Download URL: ", downloadUrl)

        // Create new product in firestore
        const newProductId = await newDoc({
            downloadUrl,
            title: newTitle,
            description: product.description,
            price: product.price,
            tags: product.tags,
            series: product.series!,
            seriesOrder: nextIndex, // new product is always first in series
            stripeProductId: product.stripeProductId!,
            stripePriceId: product.stripeProductId!,
        })
        if (!newProductId) throw new Error("Error creating new product");

        //Update the current photo state
        const updatedPhotos = [...allPhotos, {
            id: newProductId,
            imageUrl: downloadUrl,
            title: newTitle,
            description: product.description,
            price: product.price,
            tags: product.tags,
            series: product.series!,
            seriesOrder: nextIndex, // new product is always first in series
            stripeProductId: product.stripeProductId!,
            stripePriceId: product.stripeProductId!,
        }]
        handleSetAllPhotos(updatedPhotos)
        
        navigate("/shop")

    }

    function resetState() {
        setFile(null);
        setBackground("");
    }

    function handleClickBack() {
        resetState();
        handleBack();
        navigate("/shop")
    }
    if (product) return (
        <div className="flex flex-col justify-center items-center w-screen h-fit overflow-scroll">

            <form onSubmit={handleSubmit} onKeyDown={preventEnterFromSubmitting}
                className="bg-white flex flex-col justify-evenly m-auto items-center w-[85vw] h-fit border-2 border-black rounded-md p-4 mt-4 gap-4"
                style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>

                <MainFormTemplate handleClickBack={handleClickBack} resetState={resetState} >

                    <h2 className="text-2xl p-2 rounded-md bg-white">Add Series Photo</h2>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="file"
                            className="p-4 bg-green-500 text-white cursor-pointer rounded-md flex items-center justify-center gap-4">Upload Image <IoIosCamera />
                        </label>
                        <input type="file" id="file" placeholder="Product Image"
                            className="hidden" onChange={(e) => handleFileChange(e, setFile, setBackground)} />
                        {file ? <p className="text-center w-full m-auto py-1 px-2 rounded-md text-xs text-gray-400 bg-white">{file.name}</p> : <p className="text-xs text-gray-400">No file selected</p>}
                    </div>

                    <button type="submit"
                        className="p-2 rounded-md text-white bg-edcPurple-60 w-[15rem] mb-4">Submit</button>

                </MainFormTemplate>


            </form>

            {progress > 0 && <LoadingBar progress={progress} />}
        </div>
    )
}