import { User } from "firebase/auth";
import Frame from "../../Components/Frame/Frame";
import { useEffect, useState } from "react";
import { getPhotos } from "../../firebase/getPhotos";
import { IProductInfo } from "../../Interfaces/IProduct";
import LoadPhotos from "../../Components/Photos/LoadPhotos";
import ProductDetails from "../../Components/ProductDetails/ProductDetails";
import ShoppingButtons from "../../Components/Frame/ShoppingButtons";

interface iParams {
    u: User | null
    handleAddToCart: (id: string) => void
}
export default function Shop({ u, handleAddToCart }: iParams) {
    const [inventory, setInventory] = useState<IProductInfo[][]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showDetails, setShowDetails] = useState(false)
    const [productDetailsIndex, setProductDetailsIndex] = useState(0)

    useEffect(() => {
        async function fetchPhotos() {
            const resp = await getPhotos({ tags: ["inventory"], shuffle: false })
            if (resp) {
                const groupedPhotos: IProductInfo[][] = []
                const photoMap: { [key: string]: IProductInfo[] } = {};
                resp.forEach(photo => {
                    const key = photo.series ?? "uncategorized";
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
            }
        }
        fetchPhotos();
    }, [])

    function handleClickProductDetails (index: number) {
        setProductDetailsIndex(index)
        setShowDetails(true)
    }

    function handleCloseProductDetails() {
        setShowDetails(false)
    }



    return (
        <div className="w-screen h-fit p-4 flex flex-col md:flex-wrap md:flex-row justify-center items-center gap-[1rem] overflow:hidden">
            {
                showDetails
                    ? <ProductDetails product={inventory[productDetailsIndex]} handleCloseProductDetails={handleCloseProductDetails} />
                    : isLoading ? <LoadPhotos /> :
                        <>
                            {inventory.length > 0 && inventory.map((photos, index) => (
                                <div key={index} className="h-fit w-screen flex-wrap flex md:w-[19rem] p-4">
                                    <Frame photos={photos} arrayIndex={index} additionalClass="w-[19rem]" hover u={u} name={photos[0].title} isInventory handleClickProductDetails={handleClickProductDetails}>
                                        <ShoppingButtons product={photos[0]} handleDetails={handleClickProductDetails} />
                                    </Frame>
                                </div>
                            ))}
                        </>
            }
        </div>
    )
}