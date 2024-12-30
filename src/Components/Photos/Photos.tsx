import { useEffect, useState } from "react"
import { getPhotos } from "../../flickr"
import { FlickrPhoto } from "../../Interfaces/FlickrPhoto";
import Frame from "../Frame/Frame";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function Photos() {
    const [photos, setPhotos] = useState<FlickrPhoto[]>([])
    const [mySwitch, setMySwitch] = useState<boolean>(false)

    useEffect(() => {
        async function fetchPhotos() {
            const resp = await getPhotos();
            if (resp) {
                console.log(resp)
                setPhotos(resp)
            }
        }
        fetchPhotos();
    }, [mySwitch])

    return (
        <div className="relative">
            <div className="bg-white absolute left-0 top-1/2 w-[4rem] flex justify-center hover: cursor-pointer z-10"
            onClick={() => getPhotos()}><IoIosArrowBack size={40}  /></div>
        <div className="
        bg-yellow-500 bg-opacity-50 
        m-auto overflow-hidden 
        w-[60vw] h-[60vw] max-h-[45rem] max-w-[45rem]
        flex justify-center items-center
        rounded-full">
            {
                photos.map((photo) => {
                    const rand = Math.random()
                    const shiftX = (Math.random() - .5) * 15
                    const shiftY = (Math.random() - .5) * 15
                    return (
                        <div
                            key={photo.id}
                            className="relative"
                            style={{ transform: `translate(${shiftX}vw, ${shiftY}vh)` }}>
                            <Frame src={photo.url_l} alt={photo.title} size={Math.abs(rand - .5) + .25} name={photo.title} />
                        </div>
                    )
                })
            }
        </div>
            <div className="bg-white absolute right-0 top-1/2 w-[4rem] flex justify-center hover: cursor-pointer z-10"
            onClick={() => setMySwitch(!mySwitch)}><IoIosArrowForward size={40}  /></div>
            </div>
    )
}