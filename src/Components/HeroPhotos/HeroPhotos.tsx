import Frame from "../Frame/Frame";
import AdminButtons from "../Buttons/AdminButtons";
import { useState } from "react";
import { useUserContext } from "../../Context/UserContext";
import EditHeroForm from "../Forms/EditHeroForm";
import { IHero } from "../../Interfaces/IHero";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";

export default function HeroPhotos() {
    const { user } = useUserContext();
    const {heroPhotos} = useProductManagementContext();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [heroToEdit, setHeroToEdit] = useState<IHero | null>(null);

    function handlePhotoEditClick(hero: IHero) {
        setIsEditing(true);
        setHeroToEdit(hero);
    }

    return ( <>
    {isEditing && <EditHeroForm heroToEdit={heroToEdit} onClose={() => setIsEditing(false)} />}
        <div className="w-[100vw] h-[45vh] flex justify-center items-center">
            {heroPhotos.length > 0 &&
                heroPhotos.map((photo, key) => {
                    return (
                        <div key={key} className="
                            flex-shrink-0
                            w-[10rem] md:w-[12rem] lg:w-[14rem] p-4 h-full">
                            <Frame >
                                <img src={photo.url} alt="Model Photo" className="rounded-md h-full w-full object-cover object-center" />
                                {user && <AdminButtons handleEdit={() => handlePhotoEditClick(photo)} />}
                            </Frame>
                        </div>
                    )
                })
            }
        </div>
    </>
    )
}