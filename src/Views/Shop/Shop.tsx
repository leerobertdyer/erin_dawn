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
import { sortProducts, getDateInMillis } from "../../util/productSorter";
import { IGeneralPhoto } from "../../Interfaces/IPhotos";
import NewProductForm from "../../Components/Forms/NewProductForm";
import AddProductCard from "../../Components/AddProductCard/AddProductCard";
import EditProductForm from "../../Components/Forms/EditProductForm";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

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
    const [showSortModal, setShowSortModal] = useState(false)

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const category = params.get('category');
        if (category) {
            setIsFiltered(true)
            const filteredPhotos = allProducts.filter(p => p.category === category && !p.sold);
            if (filteredPhotos.length > 0) {
                setFilteredInventory(filteredPhotos);
            }
            else setIsFiltered(false)
        } else {
            setIsFiltered(false)
            const filteredPhotosArray = allProducts.filter(p =>
                (!p.hidden || (user && p.hidden)) && !p.sold
            )
            const sortedArray = sortProducts(filteredPhotosArray, 'newest');

            setFilteredInventory(sortedArray);
        }
    }, [location.search, allProducts, setFilteredInventory, user]);

    useEffect(() => {
        const nextInventory = [...filteredInventory]

        // Sort products by creation date (newest first)
        const groupedPhotos = nextInventory.sort((a, b) => {
            return getDateInMillis(b.createdAt) - getDateInMillis(a.createdAt);  // Newest first
        });

        setInventory(groupedPhotos);  // Wrap in array to maintain existing component structure
    }, [user, filteredInventory]);

    function sortInventory(method: string) {
        switch (method) {
            case "newest": 
                setInventory([...inventory.sort((a, b) => {
                    return getDateInMillis(b.createdAt) - getDateInMillis(a.createdAt); // Newest first
                })])
                break;
            case "oldest": 
                setInventory([...inventory.sort((a, b) => {
                    return getDateInMillis(a.createdAt) - getDateInMillis(b.createdAt); // Oldest first
                })])
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
        sortInventory(sortBy)
    }, [sortBy])

    function handleSortChange(value: string) {
        setSortBy(value)
        setIsFiltered(value !== 'all');
        value === "all" && navigate("/shop")
        setShowSortModal(false)
    }

    function handleClearFilter() {
        setSortBy('all')
        setIsFiltered(false)
        setShowSortModal(false)
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

    return (<div className="w-full h-fit min-h-screen bg-[url('/images/background.jpg')] bg-contain bg-repeat">

        {showSortModal ? <div className="fixed w-full h-[20rem] bg-edcPurple-80 text-white z-20 flex flex-col items-center bottom-0">
            <div className="w-full mb-2 flex justify-center items-center p-2" onClick={() => setShowSortModal(false)}>
                Close <IoIosArrowDown className="w-8 h-8 rounded-full" />
               
                {isFiltered && <button onClick={() => handleClearFilter()}
                className="bg-white p-2 rounded-md text-black z-[60] fixed bottom-[1rem] ">
                Clear Filter</button>}

            </div>
            Sort Products By
            <select 
                className="border-2 border-white text-center rounded-md text-black min-w-[10rem]"
                onChange={(e) => handleSortChange(e.target.value)} value={sortBy}>
                <option value="all">All</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="high">Price: high-low</option>
                <option value="low">Price: low-high</option>
            </select>
        </div> : <div className="text-xl text-white fixed bottom-0 z-20 w-full bg-edcPurple-80 flex justify-center items-center gap-2 py-2" onClick={() => setShowSortModal(true)} >
            Sort <IoIosArrowUp className="w-8 h-8 border-2 border-black rounded-lg" />
        </div>}

        <div className="w-full min-h-screen flex flex-col items-center">
            
            {showProductForm && <NewProductForm onClose={() => setShowProductForm(false)} />}
            {showEditProductForm && <EditProductForm onClose={() => setShowEditProductForm(false)} product={productToEdit} />}

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