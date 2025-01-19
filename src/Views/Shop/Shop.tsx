import { User } from "firebase/auth";
import Frame from "../../Components/Frame/Frame";
import { useEffect, useState } from "react";
import { IProductInfo } from "../../Interfaces/IProduct";
import ProductDetails from "../../Components/ProductDetails/ProductDetails";
import ShoppingButtons from "../../Components/Buttons/ShoppingButtons";
import AdminButtons from "../../Components/Buttons/AdminButtons";
import BatchEdit from "../../Components/BatchEdit/BatchEdit";
import ProductForm from "../../Components/ProductForm/ProductForm";
import Carousel from "../../Components/Carousel/Carousel";
import { useProductManagement } from "../../Hooks/useProductMgmt";
import LoadPhotos from "../../Components/HeroPhotos/LoadPhotos";
import { usePhotosContext } from "../../Context/PhotosContext";

interface IShop {
    u: User | null
}
export default function Shop({ u, }: IShop) {
    const { handleBack, handleEdit, isEditing, isBatchEdit, handleBatchEdit } = useProductManagement();
    const { allPhotos } = usePhotosContext();
    const [inventory, setInventory] = useState<IProductInfo[][]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showDetails, setShowDetails] = useState(false)
    const [arrayIndex, setArrayIndex] = useState(0)

    useEffect(() => {
        const nextInventory = allPhotos.filter(photo => photo.tags.includes("inventory"))
        console.log('nextInventory: ', nextInventory)
        const groupedPhotos: IProductInfo[][] = []
        const photoMap: { [key: string]: IProductInfo[] } = {};
        nextInventory.forEach(photo => {
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
        if (u) groupedPhotos.push([{ id: "new", title: "New Product", description: "Add a new product to the inventory", imageUrl: "images/card.jpg", price: 0, series: "uncategorized", tags: ["inventory"] }])
        setInventory(groupedPhotos.sort((a, b) => (a[0].order ?? 0) - (b[0].order ?? 0)))
    if (groupedPhotos.length > 0) setIsLoading(false)
    }, [u, allPhotos])

    function handleClickProductDetails(index: number) {
        setArrayIndex(index)
        setShowDetails(true)
    }

    function handleCloseProductDetails() {
        setShowDetails(false)
    }

    if (isBatchEdit) {
        return <BatchEdit products={inventory[arrayIndex] ?? []} u={u ?? null} handleBack={handleBack} handleEdit={handleEdit} />
    } else if (isEditing) {
        return <div className="w-screen h-screen bg-white fixed top-0 left-0 z-50 flex justify-center items-center">
            <ProductForm />
        </div>
    } else if (isLoading) {
        return <LoadPhotos count={3} size="medium" />
    } else if (showDetails) {
        return <ProductDetails product={inventory[arrayIndex]} handleCloseProductDetails={handleCloseProductDetails} />
    }

    else return (
        <div className="w-screen h-fit p-4 flex flex-col md:flex-wrap md:flex-row justify-center items-center gap-[1rem] overflow:hidden">
            {inventory.length > 0 && inventory.map((series, index) => (
                <div key={index} className="h-fit w-screen flex-wrap flex md:w-[19rem] p-4">
                    <Frame>
                        {series.length === 1
                            ? u && series[0].id === "new" ?
                            <div className="h-[505px] flex flex-col justify-around items-center">
                                <img src="/images/card.jpg" alt="Add a new product" className="rounded-md" />
                                Add New Product
                                <AdminButtons addProduct={true}  />
                            </div>
                                :
                                <>
                                    <img src={series[0].imageUrl} alt={series[0].title} className="rounded-md" />
                                    {u && <AdminButtons handleEdit={() => handleEdit(series[0].id)} />}
                                    <ShoppingButtons product={series[0]} handleDetails={() => handleClickProductDetails(index)} />
                                </>
                            : <Carousel photos={series.map(photo => ({ id: photo.id, url: photo.imageUrl, title: photo.title, seriesOrder: photo.seriesOrder ?? 0 }))} >
                                {u && <AdminButtons handleEdit={handleBatchEdit} />}
                                <ShoppingButtons product={series[index]} handleDetails={() => handleClickProductDetails(index)} />
                            </Carousel>}
                    </Frame>
                </div>
            ))}
        </div>
    )
}