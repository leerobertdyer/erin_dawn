import { User } from "firebase/auth";
import Frame from "../Frame/Frame";
import AdminButtons from "../Buttons/AdminButtons";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { usePhotosContext } from "../../Context/PhotosContext";

export default function Main({ u }: { u: User | null }) {
    const { handleEdit } = useProductManagementContext();
    const { allPhotos } = usePhotosContext();
    const mainPagePhotos = allPhotos.filter(p => p.tags.includes("mainPage"));

// TODO: Update to use photo.category 
// TODO: Update to use appropriate form

    return (
        <div
            className="w-full h-fit 
            bg-white bg-opacity-80 
            py-8 px-4 flex-wrap
            border-y-4 border-yellow-400 border-double border-opacity-40
            flex flex-col sm:flex-row justify-center items-center gap-[4rem]">
            {mainPagePhotos.map((mpPhoto, key) =>

                <Frame key={key} additionalClass="w-[87vw] md:w-[40vw] lg:w-[35vw] h-auto" hover={true} >
                    <img src={mpPhoto.imageUrl} alt="Embellished Vintage" className="rounded-md h-full w-auto object-cover object-center" />
                    <button className="text-center text-lg">{mpPhoto.category}</button>
                    {u && <AdminButtons handleEdit={() => handleEdit(mpPhoto.id)} />}
                </Frame>

            )}
        </div>
    )
}