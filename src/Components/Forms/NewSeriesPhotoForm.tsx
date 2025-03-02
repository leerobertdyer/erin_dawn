import { useEffect, useState } from "react";
import { handleFileChange, preventEnterFromSubmitting } from "./formUtil";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { IoIosCamera } from "react-icons/io";
import MainFormTemplate from "./MainFormTemplate";
import uploadFile from "../../firebase/uploadFile";
import { newDoc } from "../../firebase/newDoc";
import LoadingBar from "../LoadingBar/LoadingBar";
import { useNavigate } from "react-router-dom";
import { usePhotosContext } from "../../Context/PhotosContext";
import { resizeFile } from "../../util/resizeFile";
import { NEW_PRODUCT_DEFAULT_HEIGHT, NEW_PRODUCT_DEFAULT_WIDTH, NEW_PRODUCT_IMAGE_QUALITY } from "../../util/constants";

export default function NewSeriesPhotoForm() {
    const [background, setBackground] = useState("/images/background.jpg");
    const [file, setFile] = useState<File | null>();
    const [progress, setProgress] = useState(0);

    const { handleBack, product } = useProductManagementContext();
    const { allPhotos, setAllPhotos } = usePhotosContext();

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

        const nextIndex = allPhotos.filter(photo => photo.itemName === product.itemName).length + 1

        const safeTitle = `${product.title.replace(/ /g, "_")}${nextIndex}`

        const rezisedFile = await resizeFile(file, {
            maxWidth: NEW_PRODUCT_DEFAULT_WIDTH,
            maxHeight: NEW_PRODUCT_DEFAULT_HEIGHT,
            maintainAspectRatio: true,
            quality: NEW_PRODUCT_IMAGE_QUALITY
        });

        const fileToUpload = {
            reference: safeTitle,
            file: rezisedFile,
            onProgress: onProgress,
        }

        // Upload file to storage return download url
        const downloadUrl = await uploadFile(fileToUpload);

        // Create new product in firestore
        const newProductId = await newDoc({
            downloadUrl,
            title: product.title,
            description: product.description,
            price: product.price,
            size: product.size,
            dimensions: product.dimensions,
            category: product.category ?? "uncategorized",
            tags: product.tags,
            series: product.series!,
            itemName: product.itemName,
            itemOrder: nextIndex,
            stripeProductId: product.stripeProductId!,
            stripePriceId: product.stripeProductId!,
        })
        if (!newProductId) throw new Error("Error creating new product");

        //Update the current photo state
        setAllPhotos([
            ...allPhotos,
            {
                id: newProductId,
                imageUrl: downloadUrl,
                title: product.title,
                description: product.description,
                price: product.price,
                size: product.size,
                dimensions: product.dimensions,
                tags: product.tags,
                series: product.series!,
                itemName: product.itemName,
                itemOrder: nextIndex,
                stripeProductId: product.stripeProductId!,
                stripePriceId: product.stripeProductId!,
            }
        ]);

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
                        className="
                        bg-edcPurple-60 text-white 
                        hover:bg-yellow-500 hover:text-edcPurple-60 
                        rounded-md p-2 w-full">
                        Submit</button>

                </MainFormTemplate>


            </form>

            {progress > 0 && <LoadingBar progress={progress} />}
        </div>
    )
}