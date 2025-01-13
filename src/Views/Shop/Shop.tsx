import { User } from "firebase/auth";
import Frame from "../../Components/Frame/Frame";
import { useEffect, useState } from "react";
import { getPhotos } from "../../firebase/getPhotos";
import { IProductInfo } from "../../Interfaces/IProduct";
import LoadPhotos from "../../Components/HeroPhotos/LoadPhotos";
import ProductDetails from "../../Components/ProductDetails/ProductDetails";
import ShoppingButtons from "../../Components/Buttons/ShoppingButtons";
import AdminButtons from "../../Components/Buttons/AdminButtons";
import BatchEdit from "../../Components/BatchEdit/BatchEdit";
import ProductForm from "../../Components/ProductForm/ProductForm";
import Carousel from "../../Components/Carousel/Carousel";
import { useProductManagement } from "../../Hooks/useProductMgmt";

interface IShop {
    u: User | null
}
export default function Shop({ u, }: IShop) {
    const { handleBack, handleEdit, isEditing, isBatchEdit, product, updateProduct, handleDelete, handleBatchEdit, handleFinishEdit } = useProductManagement();
    const [inventory, setInventory] = useState<IProductInfo[][]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showDetails, setShowDetails] = useState(false)
    const [arrayIndex, setArrayIndex] = useState(0)

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

    function handleClickProductDetails(index: number) {
        setArrayIndex(index)
        setShowDetails(true)
    }

    function handleCloseProductDetails() {
        setShowDetails(false)
    }


    return (
        (isBatchEdit) ? <BatchEdit products={inventory[arrayIndex] ?? []} u={u ?? null} handleBack={handleBack} handleEdit={handleEdit} />
            : (isEditing)
                ?
                <div className="w-screen h-screen bg-white fixed top-0 left-0 z-50 flex justify-center items-center">
                    <ProductForm product={product} isEditing={isEditing} handleEdit={handleEdit} handleFinishEdit={handleFinishEdit} updateProduct={updateProduct} handleDelete={handleDelete} />
                </div>
                :
                <div className="w-screen h-fit p-4 flex flex-col md:flex-wrap md:flex-row justify-center items-center gap-[1rem] overflow:hidden">
                    {
                        showDetails
                            ? <ProductDetails product={inventory[arrayIndex]} handleCloseProductDetails={handleCloseProductDetails} />
                            : isLoading ? /* TODO: Fix loading screen to match style */ <LoadPhotos /> :
                                <>
                                    {inventory.length > 0 && inventory.map((series, index) => (
                                        <div key={index} className="h-fit w-screen flex-wrap flex md:w-[19rem] p-4">
                                            <Frame>
                                                {series.length === 1
                                                    ?
                                                    <>
                                                        <img src={series[0].imageUrl} alt={series[0].title} className="rounded-md" />
                                                        {u && <AdminButtons handleEdit={() => handleEdit(series[0].id)} />}
                                                        <ShoppingButtons product={series[0]} handleDetails={() => handleClickProductDetails(index)} />
                                                    </>
                                                    : <Carousel photos={series.map(photo => ({ id: photo.id, url: photo.imageUrl, title: photo.title, seriesOrder: photo.seriesOrder ?? 0 }))} >
                                                        {u && <AdminButtons handleEdit={handleBatchEdit} />}
                                                        <ShoppingButtons product={series[index]} handleDetails={() => handleClickProductDetails(index)} />
                                                    </Carousel>
                                                }
                                            </Frame>
                                        </div>
                                    ))}
                                </>
                    }
                </div>
    )
}