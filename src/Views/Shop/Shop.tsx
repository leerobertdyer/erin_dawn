import Frame from "../../Components/Frame/Frame";
import { useEffect, useState } from "react";
import { IProductInfo } from "../../Interfaces/IProduct";
import ProductDetails from "../../Components/ProductDetails/ProductDetails";
import ShoppingButtons from "../../Components/Buttons/ShoppingButtons";
import AdminButtons from "../../Components/Buttons/AdminButtons";
import PhotoManager from "../../Components/PhotoManager/PhotoManager";
import Carousel from "../../Components/Carousel/Carousel";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../../Context/UserContext";
import { editProductDoc } from "../../firebase/editDoc";
import { sortProducts } from "../../util/productSorter";
import { IGeneralPhoto } from "../../Interfaces/IPhotos";
import NewProductForm from "../../Components/Forms/NewProductForm";
import AddProductCard from "../../Components/AddProductCard/AddProductCard";
import EditProductForm from "../../Components/Forms/EditProductForm";

export default function Shop() {
    const { setFilteredInventory, filteredInventory } = useProductManagementContext();
    const { user } = useUserContext();
    const location = useLocation();
    const navigate = useNavigate();
    const { allProducts, setAllProducts } = useProductManagementContext();
    const [inventory, setInventory] = useState<IProductInfo[]>([])
    const [showDetails, setShowDetails] = useState(false)
    const [isFiltered, setIsFiltered] = useState(false)
    const [showPhotoManager, setShowPhotoManager] = useState(false)
    const [showProductForm, setShowProductForm] = useState(false)
    const [productToEdit, setProductToEdit] = useState<IProductInfo | null>(null)
    const [showEditProductForm, setShowEditProductForm] = useState(false)
    const [sortBy, setSortBy] = useState('newest')

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const category = params.get('category');
        if (category) {
            setIsFiltered(true)
            const filteredPhotos = allProducts.filter(p => p.category === category);
            if (filteredPhotos.length > 0) {
                setFilteredInventory(filteredPhotos);
            }
            else setIsFiltered(false)
        } else {
            setIsFiltered(false)
            const filteredPhotosArray = allProducts.filter(p =>
                !p.hidden || (user && p.hidden)
            )
            const sortedArray = sortProducts(filteredPhotosArray, 'newest');

            setFilteredInventory(sortedArray);
        }
    }, [location.search, allProducts, setFilteredInventory, user]);

    useEffect(() => {
        const nextInventory = [...filteredInventory]

        // Sort products by creation date (newest first)
        const groupedPhotos = nextInventory.sort((a, b) => {
            const dateA = a.createdAt ? Date.parse(a.createdAt.toString()) : 0;
            const dateB = b.createdAt ? Date.parse(b.createdAt.toString()) : 0;
            return dateA - dateB;  // Newest first
        });

        setInventory(groupedPhotos);  // Wrap in array to maintain existing component structure
    }, [user, filteredInventory]);

    function sortInventory(method: string) {
        switch (method) {
            case "newest": 
                setInventory([...inventory.sort((a, b) => Date.parse(a.createdAt.toString()) - Date.parse(b.createdAt.toString()))])
                break;
            case "oldest": 
                setInventory([...inventory.sort((a, b) => Date.parse(b.createdAt.toString()) - Date.parse(a.createdAt.toString()))])
                break;
            case "low": 
                setInventory([...inventory.sort((a, b) => a.price - b.price)])
                break;
            case "high": 
                setInventory([...inventory.sort((a, b) => b.price - a.price)])
                break;
        }
    }

    useEffect(() => {
        console.log(`sorting by ${sortBy}`)
        sortInventory(sortBy)
    }, [sortBy])

    function handleSortChange(value: string) {
        setSortBy(value)
        setIsFiltered(value !== 'all');
        value === "all" && navigate("/shop")
    }

    function handleClearFilter() {
        setSortBy('all')
        setIsFiltered(false)
    }

    function handleBack() {
        setProductToEdit(null)
        setShowDetails(false)
        setShowPhotoManager(false)
    }

    function handleClickProductDetails(product: IProductInfo) {
        setProductToEdit(product)
        setShowDetails(true)
    }

    function handleCloseProductDetails() {
        setProductToEdit(null)
        setShowDetails(false)
    }

    function handleAddPhotoToSeries(product: IProductInfo) {
        setProductToEdit(product)
        setShowPhotoManager(true)
    }

    function handleEdit(product: IProductInfo) {
        setProductToEdit(product)
        setShowEditProductForm(true)
    }

    async function hideProduct(p: IProductInfo) {
        p.hidden = !p.hidden
        await editProductDoc({ ...p })
        setAllProducts(allProducts.map(product => product.id !== p?.id
            ? product
            : { ...product, hidden: p.hidden }
        ));
    }

    async function handleSave(filesToUpload: IGeneralPhoto[]) {
        console.log("Photos Uploading: ", filesToUpload)
        setShowPhotoManager(false)
        await editProductDoc({ ...productToEdit, photos: filesToUpload })
    }

    if (showDetails) {
        return <ProductDetails
            product={productToEdit}
            handleCloseProductDetails={handleCloseProductDetails}
        />
    }

    if (showPhotoManager && productToEdit) {
        return <PhotoManager
            product={productToEdit}
            handleBack={handleBack}
            onSave={handleSave}
        />;
    }

    return (<div className="w-full">

        <div className="fixed top-16 w-full z-20 flex flex-col items-center p-2">
            <select 
                className="w-fit border-2 border-black text-center rounded-md"
                onChange={(e) => handleSortChange(e.target.value)} value={sortBy}>
                <option value="all">All</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="high">Price: high-low</option>
                <option value="low">Price: low-high</option>
            </select>
        </div>
        <div className="w-full min-h-screen flex flex-col items-center">
            
            {showProductForm && <NewProductForm onClose={() => setShowProductForm(false)} />}
            {showEditProductForm && <EditProductForm onClose={() => setShowEditProductForm(false)} product={productToEdit} />}

            {isFiltered && <button onClick={() => handleClearFilter()}
                className="bg-white border-2 border-edcPurple-60 p-2 rounded-md z-[60] fixed bottom-[1rem] ">
                Clear Filter</button>}

            <div className="w-full flex flex-wrap justify-center gap-8 p-4">

                {user && <div className="w-[20rem]">
                    <AddProductCard addProduct={() => setShowProductForm(true)} />
                </div>}

                {inventory.map((product) => (
                    <Frame key={product.id} additionalClass="w-[20rem] h-[30rem] relative">
                            <p className="text-edcPurple-80 text-2xl">{product.title}</p>
                        <div className="flex flex-col justify-between items-center h-full w-full">
                            <Carousel product={product} height="h-[15rem]" width="w-[15rem]">
                                {user && (
                                    <AdminButtons
                                        hidden={product.hidden}
                                        hideProduct={() => hideProduct(product)}
                                        handleEdit={() => handleEdit(product)}
                                        addPhotoToSeries={() => handleAddPhotoToSeries(product)}
                                    />
                                )}
                                <ShoppingButtons
                                    product={product}
                                    handleDetails={() => handleClickProductDetails(product)}
                                />
                            </Carousel>
                        </div>
                    </Frame>
                ))}
            </div>
        </div>
    </div>
    );
}