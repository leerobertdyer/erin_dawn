import { useEffect, useState } from "react"
import { getPhotos } from "../../flickr"
import { FlickrPhoto } from "../../Interfaces/FlickrPhoto";
import Frame from "../Frame/Frame";

export default function Photos() {
    const [photos, setPhotos] = useState<FlickrPhoto[]>([])

    useEffect(() => {
        async function fetchPhotos() {
            const resp = await getPhotos();
            if (resp) {
                console.log('resp: ', resp)
                setPhotos(resp)
            }
        }
        fetchPhotos();
    }, [])

    return (
        <div className="
        bg-slate-500 bg-opacity-50 
        m-auto overflow-hidden 
        w-[80vw] h-[80vh] 
        flex justify-center items-center
        rounded-full">
            {
                    photos.map((photo) => {
                        const rand = Math.random()
                        const shiftX = (Math.random() - .5) * 35
                        const shiftY = (Math.random() - .5) * 35
                        return (<>
                        <div 
                        className="absolute"
                        style={{ transform: `translate(${shiftX}vw, ${shiftY}vh)` }}>
                                <Frame key={photo.id} src={photo.url_l} alt={photo.title} size={Math.abs(rand - .5)+.25} name={photo.title}/>
                        </div>
                        </>
                        )
                    })
            }
        </div>
    )
}