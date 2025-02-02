import { useState } from "react";
import { handleFileChange, preventEnterFromSubmitting } from "./formUtil";
import MainFormTemplate from "./MainFormTemplate";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { IoIosCamera } from "react-icons/io";
import LoadingBar from "../LoadingBar/LoadingBar";
import CustomInput from "../CustomInput/CustomInput";
import { useNavigate } from "react-router-dom";
import editFile from "../../firebase/editfile";
import { resizeFile } from "../../util/resizeFile";
import editDoc from "../../firebase/editDoc";
import { usePhotosContext } from "../../Context/PhotosContext";

export default function EditCategoryForm() {
    const { product } = useProductManagementContext();
    const { allPhotos, setAllPhotos } = usePhotosContext();
    const navigate = useNavigate();
    const [background, setBackground] = useState(product?.imageUrl ?? "");
    const [category, setCategory] = useState(product?.category ?? "");
    const [file, setFile] = useState<File | null>();
    const [progress, setProgress] = useState(0);

    // TODO - wondering if we change a category name, if we need to update then all the products that use that category name.....

    function onProgress(percent: number) {
        setProgress(percent);
    }

    function handleBack() {
        navigate('/')
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // todo: implement handleSubmit
        if (!product) return;
        let downloadUrl = "";
        if (file) {
            const resizedFile = await resizeFile(file, 1200, 1400);
            const fileToEdit = {
                id: product.id,
                title: product.title,
                description: product.description ?? category,
                price: product.price ?? 1,
                tags: product.tags,
                url: product.imageUrl,
                size: product.size ?? "",
                category,
                series: product.series ?? "",
                itemOrder: product.itemOrder ?? 0,
                itemName: product.itemName ?? category,
                stripePriceId: product.stripePriceId ?? "na",
                stripeProductId: product.stripeProductId ?? "na",
                file: resizedFile,
                onProgress,
            }

            downloadUrl = await editFile(fileToEdit);
            if (!downloadUrl) return;
        } else { // if no file just edit the category name for all products with that category
            const productsWithCategory = allPhotos.filter(photo => photo.category === product.category)

            for (const photo of productsWithCategory) {
                if (photo.id === product.id) continue;
                await editDoc({
                    ...photo,
                    itemName: photo.itemName ?? photo.category,
                    itemOrder: photo.itemOrder ?? 1,
                    imageUrl: file ? downloadUrl : undefined,
                    size: photo.size ?? "",
                    category,
                })
            }
        }

        setAllPhotos(allPhotos.map(photo => {
            if (photo.id === product.id) {
                return {
                    ...photo,
                    category,
                    imageUrl: file ? downloadUrl : photo.imageUrl,
                    stripeProductId: "na",
                    stripePriceId: "na",
                }
            } if (photo.category === product.category) {
                console.log('updating category in ', photo.title)
                return {
                    ...photo,
                    category,
                }
            }
            return photo
        }));

        handleBack();
    }


    function resetState() {
        setBackground(product?.imageUrl ?? "");
        setFile(null);
    }

    return (
        <div className="flex flex-col justify-center items-center w-screen h-fit overflow-scroll">
            <h2 className="text-2xl p-2 rounded-md bg-white ">Change The Category </h2>

            <form onSubmit={handleSubmit} onKeyDown={preventEnterFromSubmitting}
                className="bg-white flex flex-col justify-center m-auto items-center w-[85vw] h-screen border-2 border-black rounded-md p-4 mt-4 gap-4"
                style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <MainFormTemplate product={product} handleClickBack={handleBack} resetState={resetState}>
                    <div className="flex flex-col gap-2">
                        <div className="bg-white bg-opacity-50 p-4 w-full h-full flex flex-col justify-center items-center">
                            This form edits the home page photo and the name of the category.
                        </div>

                        <CustomInput type="text" label="Category Name" placeholder="Category Name" value={category} onChange={(e) => setCategory(e.target.value)} />
                        <label htmlFor="file"
                            className="p-4 bg-green-500 text-white cursor-pointer rounded-md flex justify-center gap-4">Upload Image <IoIosCamera />
                        </label>
                        <input type="file" id="file" placeholder="Product Image"
                            className="hidden" onChange={(e) => handleFileChange(e, setFile, setBackground)} />
                        <p className="text-center w-full m-auto py-1 px-2 rounded-md text-xs text-gray-400 bg-white">{file ? file.name : "No File Selected"}</p>
                    </div>

                    <button type="submit"
                        disabled={progress > 0}
                        className="
                    bg-edcPurple-60 text-white 
                    hover:bg-yellow-500 hover:text-edcPurple-60 
                    rounded-md p-2 w-full">
                        Submit</button>

                </MainFormTemplate>
                {progress > 0 && <LoadingBar progress={progress} />}
            </form>
        </div>
    )
}