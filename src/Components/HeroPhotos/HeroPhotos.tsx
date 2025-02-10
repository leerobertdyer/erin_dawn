
import Frame from "../Frame/Frame";
import LoadPhotos from "./LoadPhotos";
import AdminButtons from "../Buttons/AdminButtons";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { usePhotosContext } from "../../Context/PhotosContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../Context/UserContext";


export default function HeroPhotos() {
    const { allPhotos, isLoading, } = usePhotosContext();
    const { user } = useUserContext();

    const photos = allPhotos.filter(photo => photo.tags.includes("hero"))
    
    const { isEditing, handleEdit, setPreviousUrl } = useProductManagementContext();
    const navigate = useNavigate();

    useEffect(() => {
        setPreviousUrl(location.pathname)
    }, [location])

    useEffect(() => {
        if (isEditing) {
            navigate('/edit-hero');
        } else {
            navigate('/')
        }
    }, [isEditing, navigate]);

    //TODO: for the phone version, make the photos scrollable
    //TODO: Update the handleEdit to navigate to the right form...

    if (isLoading) return (
        <div className="w-full h-[45vh] flex justify-center items-center">
                <LoadPhotos count={4} size="medium" />
        </div>
    )

    return (<>
        <div className="w-[100vw] h-[45vh] flex justify-center items-center">
            {photos.length > 0 &&
                photos.map((photo, key) => {
                    return (
                        <div key={key} className="
                            flex-shrink-0
                            w-[10rem] md:w-[12rem] lg:w-[14rem] p-4 h-full">
                            <Frame >
                                <img src={photo.imageUrl} alt={photo.title} className="rounded-md h-full w-auto object-cover object-center" />
                                {user && <AdminButtons handleEdit={() => handleEdit(photo.id)} />}
                            </Frame>
                        </div>
                    )
                })
            }
        </div>
    </>
    )
}