import { User } from "firebase/auth";
import Frame from "../../Components/Frame/Frame";
import { useEffect, useState } from "react";
import { getPhotos } from "../../firebase/getPhotos";
import { IProductInfo } from "../../Interfaces/IProduct";
import LoadPhotos from "../../Components/Photos/LoadPhotos";

export default function Shop({ u }: { u: User | null }) {
    const [inventory, setInventory] = useState<IProductInfo[][]>([])
    const [isLoading, setIsLoading] = useState(true)

    //TODO: when clicking edit button on a collection of photos, open a view with all the photos selected, to allow choice of photo edit...

    useEffect(() => {
        async function fetchPhotos() {
            const resp = await getPhotos({ tags: ["inventory"], shuffle: false })
            if (resp) {
                const groupedPhotos: IProductInfo[][] = []
                const photoMap: { [key: string]: IProductInfo[] } = {};

                resp.forEach(photo => {
                    const key = photo.series ?? "uncategorized";
                    console.log(photo)
                    if (!photoMap[key]) {
                        photoMap[key] = [];
                    }
                    photoMap[key].push(photo);
                    photoMap[key].sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0))
                })
                for (const key in photoMap) {
                    groupedPhotos.push(photoMap[key]);
                }
                setInventory(groupedPhotos.sort((a, b) => (a[0].order ?? 0) - (b[0].order ?? 0)))
                if (resp.length > 0) {
                    setIsLoading(false)
                }
                console.log(groupedPhotos)
            }
        }
        fetchPhotos();
    }, [])

    return (
        <div className="w-screen h-fit p-4 flex flex-col md:flex-wrap md:flex-row justify-center items-center gap-[1rem] overflow:hidden">
            {isLoading && <LoadPhotos />}
            {inventory.length > 0 && inventory.map((photos, key) => (
                <div key={key} className="h-fit w-screen flex-wrap flex md:w-[19rem] p-4">
                    <Frame photos={photos} additionalClass="w-[19rem]" hover u={u} name={photos[0].title} isInventory/>
                </div>
            ))}
        </div>
    )
}