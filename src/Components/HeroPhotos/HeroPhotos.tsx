
import Frame from "../Frame/Frame";
import LoadPhotos from "./LoadPhotos";
import { User } from "firebase/auth";
import AdminButtons from "../Buttons/AdminButtons";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { usePhotosContext } from "../../Context/PhotosContext";

interface IPhotos {
    u: User | null
}
export default function HeroPhotos({ u }: IPhotos) {
    const { handleEdit, isEditing } = useProductManagementContext();
    const { allPhotos, isLoading, } = usePhotosContext();
    const photos = allPhotos.filter(photo => photo.tags.includes("hero"))

    //TODO: for the phone version, make the photos scrollable

    if (isLoading) return (
        <div className="w-full h-[45vh] flex justify-center items-center">
                <LoadPhotos count={4} size="medium" />
        </div>
    )

    return (<>
        <div className={`
            w-[100vw] ${isEditing ? "h-fit" : "h-[45vh] overflow-hidden"} 
            flex justify-center items-center
            `}>
            {photos.length > 0 &&
                photos.map((photo, key) => {
                    return (
                        <div key={key} className="
                            flex-shrink-0
                            w-[10rem] md:w-[12rem] lg:w-[14rem] p-4 h-full">
                            <Frame >
                                <img src={photo.imageUrl} alt={photo.title} className="rounded-md h-full w-auto object-cover object-center" />
                                {u && <AdminButtons handleEdit={() => handleEdit(photo.id)} />}
                            </Frame>
                        </div>
                    )
                })
            }
        </div>
    </>
    )
}