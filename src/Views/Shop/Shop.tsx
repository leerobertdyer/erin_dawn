import { User } from "firebase/auth";
import Frame from "../../Components/Frame/Frame";
import { useEffect, useState } from "react";
import { IProductInfo } from "../../Interfaces/IProduct";
import ProductDetails from "../../Components/ProductDetails/ProductDetails";
import ShoppingButtons from "../../Components/Buttons/ShoppingButtons";
import AdminButtons from "../../Components/Buttons/AdminButtons";
import BatchEdit from "../../Components/BatchEdit/BatchEdit";
import Carousel from "../../Components/Carousel/Carousel";
import LoadPhotos from "../../Components/HeroPhotos/LoadPhotos";
import { usePhotosContext } from "../../Context/PhotosContext";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { useLocation, useNavigate } from "react-router-dom";

interface IShop {
    u: User | null
}
export default function Shop({ u }: IShop) {
    const { handleBack, handleEdit, isEditing, isBatchEdit, setIsBatchEdit, setPreviousUrl, setProduct } = useProductManagementContext();
    const location = useLocation();
    const { allPhotos } = usePhotosContext();
    const [inventory, setInventory] = useState<IProductInfo[][]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showDetails, setShowDetails] = useState(false)
    const [arrayIndex, setArrayIndex] = useState(0)
    const [isAddingPhoto, setIsAddingPhoto] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        setPreviousUrl(location.pathname)
    }, [location])

    useEffect(() => {
        if (isEditing) navigate('/edit-product');
        else if (isAddingPhoto) navigate('/add-series-photo')
        else navigate('/shop')
    }, [isEditing, navigate, isAddingPhoto]);


    useEffect(() => {
        const nextInventory = allPhotos.filter(photo => photo.tags.includes("inventory"))
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
        if (u) groupedPhotos.push([{ id: "new", title: "New Product", description: "Add a new product to the inventory", imageUrl: "images/card.jpg", price: 0, series: "uncategorized", tags: ["inventory"], stripePriceId: "", stripeProductId: "", order: -10 }])
        setInventory(groupedPhotos.sort((a, b) => (a[0].order ?? 0) - (b[0].order ?? 0))) // TODO: Apply order to all products to place them in desired page area
        if (groupedPhotos.length > 0) setIsLoading(false)
    }, [u, allPhotos])

    function handleClickProductDetails(index: number) {
        setArrayIndex(index)
        setShowDetails(true)
    }

    function handleCloseProductDetails() {
        setShowDetails(false)
    }
    function handleBatchEdit(index: number) {
        setArrayIndex(index)
        setIsBatchEdit(true)
    }

    function handleAddPhotoToSeries(product: IProductInfo) {
        console.log(`Adding photo to ${product.series} series`)
        setProduct(product)
        setIsAddingPhoto(true)
    }

    if (isBatchEdit) {
        return <BatchEdit products={inventory[arrayIndex] ?? []} handleBack={handleBack} />
    } else if (isLoading) {
        return <LoadPhotos count={3} size="medium" />
    } else if (showDetails) {
        return <ProductDetails product={inventory[arrayIndex]} handleCloseProductDetails={handleCloseProductDetails} />
    }

    else return (
        <div className="w-screen h-fit p-4 flex flex-col md:flex-wrap md:flex-row justify-center items-center gap-[1rem] overflow:hidden">
            {inventory.length > 0 && inventory.map((series, index) => (
                <div key={index}
                    className="
                    h-[100vh] w-[90vw] 
                    md:h-[70vh] md:w-[45vw]
                    flex mb-[1rem]">
                    <Frame > 
                        {series.length === 1
                            ? u && series[0].id === "new" ?
                                <div className="flex flex-col justify-between items-center h-full w-full">
                                    <div className="w-full h-[50%]">

                                    <img src="/images/card.jpg" alt="Add a new product" className="w-full h-full rounded-md object-contain object-center" />
                                    </div>
                                    Add New Product
                                    <AdminButtons addProduct={true} />
                                </div>
                                :
                                <>
                                    <img src={series[0].imageUrl} alt={series[0].title} className="rounded-md h-full object-cover object-center" />
                                    {u && series[0].series && <AdminButtons addPhotoToSeries={() => handleAddPhotoToSeries(series[0])} handleEdit={() => handleEdit(series[0].id)} />}
                                    <ShoppingButtons product={series[0]} handleDetails={() => handleClickProductDetails(index)} />
                                </>
                            : <Carousel photos={series.map(photo => ({ id: photo.id, url: photo.imageUrl, title: photo.title, seriesOrder: photo.seriesOrder ?? 0 }))} >
                                {u && <AdminButtons
                                    addPhotoToSeries={() => handleAddPhotoToSeries(series[0])}
                                    handleEdit={() => handleBatchEdit(index)} />}
                                <ShoppingButtons product={series[0]} handleDetails={() => handleClickProductDetails(0)} />
                            </Carousel>}
                    </Frame>
                </div>
            ))}
        </div>
    )
}