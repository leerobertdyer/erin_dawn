import { useEffect, useState } from "react"
import { getPhotos } from "../../flickr"
import { FlickrPhoto } from "../../Interfaces/FlickrPhoto";
import Frame from "../Frame/Frame";
import LoadPhotos from "./LoadPhotos";

export default function Photos() {
    const [photos, setPhotos] = useState<FlickrPhoto[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchPhotos() {
            const resp = await getPhotos('edc', false);
            if (resp) {
                setPhotos(resp)
                if (resp.length > 0) {
                    setIsLoading(false)
                }
            }
        }
        fetchPhotos();
    }, [])

    return (
        <div className="
        w-[100vw] h-fit
        overflow-hidden
        flex justify-center items-center">
            {isLoading ? <LoadPhotos />
                : photos.length > 0 &&
                photos.map((photo) => {
                    return (
                        <div key={photo.id} className="
                        flex-grow-0 flex-shrink-0
                        w-[10rem] md:w-[12rem] lg:w-[14rem]">
                            <Frame src={photo.url_l} alt={photo.title} size="w-[10rem] md:w-[12rem]" />
                        </div>
                    )
                })
            }
        </div>
    )
}