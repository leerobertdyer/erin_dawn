import { User } from "firebase/auth";
import Frame from "../../Components/Frame/Frame";
import { useEffect, useState } from "react";
import { getPhotos } from "../../firebase/getPhotos";
import { IProductInfo } from "../../Interfaces/ProductImage";
import LoadPhotos from "../../Components/Photos/LoadPhotos";

export default function Shop({ u }: { u: User | null }) {
    const [inventory, setInventory] = useState<IProductInfo[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchPhotos() {
            const resp = await getPhotos({ tags: ["inventory"], shuffle: true })
            if (resp) {
                setInventory(resp)
                if (resp.length > 0) {
                    setIsLoading(false)
                }
            }
        }
        fetchPhotos();
    }, [])

    return (
        <div className="w-full h-screen p-4 flex flex-col md:flex-row flex-wrap justify-center items-center gap-[1rem]">
            {isLoading && <LoadPhotos />}
            {inventory.length > 0 && inventory.map((photo) => (
                    <div key={photo.id} >
                        <Frame src={photo.imageUrl} alt={photo.title} name={photo.title} size="w-[19rem] md:flex-grow" hover={false} u={u} id={photo.id} />
                    </div>
                ))}
                </div>
    )
}