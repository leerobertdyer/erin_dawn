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
import { useUserContext } from "../../Context/UserContext";
import { cardHeight, imageHeight } from "../../util/constants";
import { editDoc } from "../../firebase/editDoc";

export default function Shop() {
    const { handleBack, handleEdit, isEditing, isBatchEdit, setFilteredInventory, filteredInventory, setIsBatchEdit, setPreviousUrl, setProduct } = useProductManagementContext();
    const { user } = useUserContext();
    const location = useLocation();
    const { allPhotos, setAllPhotos } = usePhotosContext();
    const [inventory, setInventory] = useState<IProductInfo[][]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showDetails, setShowDetails] = useState(false)
    const [arrayIndex, setArrayIndex] = useState(0)
    const [isAddingPhoto, setIsAddingPhoto] = useState(false)
    const [isFiltered, setIsFiltered] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        setPreviousUrl(location.pathname)
    }, [location])

    useEffect(() => {
        if (isEditing) navigate('/edit-product');
        else if (isAddingPhoto) navigate('/add-series-photo')
    }, [isEditing, navigate, isAddingPhoto]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const category = params.get('category');
        if (category) {
            setIsFiltered(true)
            const filteredPhotos = allPhotos.filter(photo => photo.category === category);
            if (filteredPhotos.length > 0) {
                setFilteredInventory(filteredPhotos);
            }
            else setFilteredInventory(allPhotos.filter(photo => photo.tags.includes("inventory")));
        } else {
            setIsFiltered(false)
            const filteredPhotosArray = allPhotos.filter(photo => 
                photo.tags.includes('inventory') || (user && photo.tags.includes('hidden'))
            ).sort((a, b) => {
                const dateA = a.createdAt ? Date.parse(a.createdAt.toString()) : 0;
                const dateB = b.createdAt ? Date.parse(b.createdAt.toString()) : 0;
                return dateA - dateB;  // Oldest first
            });
            setFilteredInventory(filteredPhotosArray);
        }
    }, [location.search, allPhotos, setFilteredInventory, user]);


    useEffect(() => {
    const nextInventory = [...filteredInventory]
        const groupedPhotos: IProductInfo[][] = []
        const photoMap: { [key: string]: IProductInfo[] } = {};
        nextInventory.forEach(photo => {
            const key = photo.itemName ?? "uncategorized";
            if (!photoMap[key]) {
                photoMap[key] = [];
            }
            photoMap[key].push(photo);
            photoMap[key].sort((a, b) => (a.itemOrder ?? 0) - (b.itemOrder ?? 0))
        })
        for (const key in photoMap) {
            groupedPhotos.push(photoMap[key]);
        }
        if (user) groupedPhotos.push([{ id: "new", itemName: "card", title: "New Product", description: "Add a new product to the inventory", size: "", dimensions: "", imageUrl: "images/card.jpg", price: 0, series: "uncategorized", tags: ["inventory"], stripePriceId: "", stripeProductId: "", order: -10 }])
        setInventory(groupedPhotos.sort((a, b) => {
            const dateA = a[0].createdAt ? Date.parse(a[0].createdAt.toString()) : 0;
            const dateB = b[0].createdAt ? Date.parse(b[0].createdAt.toString()) : 0;
            return dateA - dateB;  // Oldest first
        }))
        if (groupedPhotos.length > 0) setIsLoading(false)
    }, [user, filteredInventory])

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
        setProduct(product)
        setIsAddingPhoto(true)
    }

    async function hideProduct(p: IProductInfo) {
        const photosToEdit = allPhotos.filter(photo => photo.itemName === p.itemName);
        let newTags = []
        p.tags.includes('hidden')
            ? newTags = [...new Set(['inventory', ...p.tags.filter(tag => tag !== 'hidden')])]
            : newTags = [...new Set(['hidden', ...p.tags.filter(tag => tag !== 'inventory')])]
        await Promise.all(photosToEdit.map(photo2edit => editDoc({...photo2edit, size: photo2edit.size, tags: newTags})))
        setAllPhotos(allPhotos.map(photo => photo.itemName !== p?.itemName 
            ? photo 
            : {...photo, tags: newTags}
        ));
    }

    if (isBatchEdit) {
        return <BatchEdit products={inventory[arrayIndex] ?? []} handleBack={handleBack} />
    } else if (isLoading) {
        return <LoadPhotos count={3} size="medium" />
    } else if (showDetails) {
        return <ProductDetails product={inventory[arrayIndex]} handleCloseProductDetails={handleCloseProductDetails} />
    }

    else return (
        <div className="
        w-screen h-fit overflow-auto 
        p-4 
        flex flex-col
        md:flex-wrap md:flex-row 
        justify-center items-center gap-[2rem] 
        relative mt-[2rem] mb-[2rem]">
            {isFiltered && <button onClick={() => navigate('/shop')}
                className="bg-white border-2 border-edcPurple-60 p-2 rounded-md z-[60] fixed bottom-[1rem] ">
                Clear Filter</button>}
            {inventory.length > 0 && inventory.map((series, index) => (
                <div key={index}
                    className={`
                        w-[22rem] ${cardHeight} flex-shrink-0
                        flex mb-[1rem]
                        `}>
                    <Frame additionalClass="h-full w-full ">
                        {series.length === 1
                            ? user && series[0].id === "new" ?
                                <div className="flex flex-col justify-between items-center h-full w-full">
                                    <div className={`w-full h-fit overflow-hidden rounded-md border-2 border-black`}>
                                        <img src="/images/card.jpg" alt="Add a new product" className="w-full h-full object-contain object-center" />
                                    </div>
                                    Add New Product
                                    <AdminButtons addProduct={true} />
                                </div>
                                :
                                <div className="flex flex-col justify-between items-center h-full w-full">
                                    <div className={`w-full ${imageHeight} rounded-md overflow-hidden border-2 border-black ${series[0].tags.includes('hidden') ? 'bg-black bg-opacity-50' : ''}`}>
                                        <img src={series[0].imageUrl} alt={series[0].title} className="w-full h-full object-cover object-center" />
                                    </div>
                                    {user && series[0].series && <AdminButtons hidden={series[0].tags.includes("hidden")} hideProduct={() => hideProduct(series[index])} addPhotoToSeries={() => handleAddPhotoToSeries(series[0])} handleEdit={() => handleEdit(series[0].id)} />}
                                    <ShoppingButtons product={series[0]} handleDetails={() => handleClickProductDetails(index)} />
                                </div>
                            : <Carousel photos={series.map(photo => ({ id: photo.id, url: photo.imageUrl, title: photo.itemName, itemOrder: photo.itemOrder ?? 0, tags: photo.tags }))} >
                                {user && <AdminButtons
                                    hidden={series[0].tags.includes("hidden")}
                                    hideProduct={() => hideProduct(series[0])}
                                    addPhotoToSeries={() => handleAddPhotoToSeries(series[0])}
                                    handleEdit={() => handleBatchEdit(index)} />}
                                <ShoppingButtons product={series[0]} handleDetails={() => handleClickProductDetails(index)} />
                            </Carousel>}
                    </Frame>
                </div>
            ))}
        </div>
    )
}