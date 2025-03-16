import { useState } from "react";
import { handleFileChange, preventEnterFromSubmitting } from "./formUtil";
import { IoIosCamera, } from "react-icons/io";
import MainFormTemplate from "./MainFormTemplate";
import editFile from "../../firebase/editfile";
import { resizeFile } from "../../util/resizeFile";
import LoadingBar from "../LoadingBar/LoadingBar";
import { NEW_PRODUCT_IMAGE_QUALITY } from "../../util/constants";
import { IHero } from "../../Interfaces/IHero";
import { editHeroDoc } from "../../firebase/editDoc";
import SubmitBtn from "../Buttons/SubmitBtn";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";

interface IEditHeroFormProps {
    onClose: () => void;
    heroToEdit: IHero
}

export default function EditHeroForm({ onClose, heroToEdit }: IEditHeroFormProps) {
    const { heroPhotos, setHeroPhotos } = useProductManagementContext();

    const [file, setFile] = useState<File | null>();
    const [progress, setProgress] = useState(0);
    const [background, setBackground] = useState(heroToEdit.url);
    const [hero, setHero] = useState<IHero>({...heroToEdit});


    function onProgress(progress: number) {
        setProgress(progress);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const resizedFile = await resizeFile(file, {
            maxWidth: 300,
            maxHeight: 400,
            maintainAspectRatio: true,
            quality: NEW_PRODUCT_IMAGE_QUALITY
        });


        const fileToEdit = {
            title: "hero" + hero.id,
            url: hero.url,
            file: resizedFile,
            onProgress,
        }

        const downloadUrl = await editFile(fileToEdit);
        console.log("Download URL: ", downloadUrl)
        if (!downloadUrl) throw new Error("Failed to update hero photo");

        const heroToUpdate = {id: heroToEdit.id, url: downloadUrl}
        setHero(heroToUpdate);

        await editHeroDoc(heroToUpdate);

        setHeroPhotos(heroPhotos.map(h => h.id === heroToUpdate.id ? heroToUpdate : h));
        
        onClose();
    }

    function resetState() {
        setFile(null);
        setBackground(heroToEdit.url);
    }


    return (

            <MainFormTemplate handleClickBack={onClose} resetState={resetState}>
        <div className="flex flex-col justify-center items-center w-screen h-fit overflow-scroll"
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}>
            <h2 className="text-2xl p-2 rounded-md bg-white ">Change this photo on home Page</h2>

            <form onSubmit={handleSubmit} onKeyDown={preventEnterFromSubmitting}
                className="bg-white bg-opacity-90 flex flex-col justify-center m-auto items-center w-[85vw] h-fit border-2 border-black rounded-md p-8 mt-4 gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="text-white bg-rose-600 rounded-md p-4 w-full h-full flex flex-col justify-center items-center">
                            This will swap out the photo on the home page.
                        </div>
                        <label htmlFor="file"
                            className="p-4 bg-edcBlue-60 text-white cursor-pointer rounded-md flex justify-center gap-4">Upload Image <IoIosCamera />
                        </label>
                        <input type="file" id="file" placeholder="Product Image"
                            className="hidden" onChange={(e) => handleFileChange(e, setFile, setBackground)} />
                        <p className="text-center w-full m-auto py-1 px-2 rounded-md text-xs text-gray-400 bg-white">{file ? file.name : "No File Selected"}</p>
                    </div>

                    <SubmitBtn progress={progress} />

                {progress > 0 && <LoadingBar progress={progress} />}
            </form>
        </div>
                </MainFormTemplate>
    )
}
