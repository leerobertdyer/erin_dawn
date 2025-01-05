import { useEffect, useState } from "react"
import Frame from "../Frame/Frame";
import LoadPhotos from "./LoadPhotos";
import { getPhotos } from "../../firebase/getPhotos";
import { IProductInfo } from "../../Interfaces/ProductImage";
import { User } from "firebase/auth";

export default function Photos( { u }: {u: User | null } ) {
    const [photos, setPhotos] = useState<IProductInfo[]>([])
    const [isLoading, setIsLoading] = useState(true)
 

    useEffect(() => {
        async function fetchPhotos() {
            const resp = await getPhotos({ tags: ["hero"], shuffle: false })
            if (resp) {
                setPhotos(resp)
                if (resp.length > 0) {
                    setIsLoading(false)
                }
            }
        }
        fetchPhotos();
    }, [])

    function handleDelete(id: string) {
        console.log("Removing from state") 
        setPhotos(photos.filter(photo => photo.id !== id))
    }

    return (
        <div className="
        w-[100vw] h-fit
        overflow-hidden
        flex justify-center items-center">
            {isLoading ? <LoadPhotos />
                : photos.length > 0 &&
                photos.map((photo, key) => {
                    return (
                        <div key={key} className="
                        flex-grow-0 flex-shrink-0
                        w-[10rem] md:w-[12rem] lg:w-[14rem]">
                            <Frame src={photo.imageUrl} alt={photo.title} size="w-[10rem] md:w-[12rem]" u={u} id={photo.id} onDelete={handleDelete}/>
                        </div>
                    )
                })
            }
        </div>
    )
}