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
import { setPageSeo } from "../../util/seo";

export default function Shop({mainAppScrollRef}: {mainAppScrollRef: React.RefObject<HTMLDivElement>}) {
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
    const [productAddedName, setProductAddedName] = useState('')

    const [selectedCategory, setSelectedCategory] = useState('Select a category')
    const [groupedInventory, setGroupedInventory] = useState<IProductInfo[][]>([])
    const [showCartPopup, setShowCartPopup] = useState(false)

    // effect to handle categories
    useEffect(() => {
        if (selectedCategory === "handmade") {
            console.log("Handmade Designs selected")
            const filteredProducts = allProducts.filter(p => p.category === "Handmade Designs" && !p.sold && !p.hidden);
            if (filteredProducts.length > 0) {
                setFilteredInventory(filteredProducts);
            }
        } else if (selectedCategory === "upcycled") {
            console.log("Embellished Vintage selected")
            const filteredProducts = allProducts.filter(p => p.category === "Embellished Vintage" && !p.sold && !p.hidden);
            if (filteredProducts.length > 0) {
                setFilteredInventory(filteredProducts);
            }
        }
    }, [allProducts, selectedCategory, setFilteredInventory])


    // Update document title for product detail view (SEO)
    useEffect(() => {
        if (productToEdit) {
            setPageSeo(location.pathname, productToEdit.title);
        } else {
            setPageSeo(location.pathname);
        }
    }, [location.pathname, productToEdit]);

    // effect to handle url params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const productId = params.get('id');
        const series = params.get('series');
        const category = params.get('category');
    
        if (productId) {
            const product = allProducts.find(p => p.id === productId);
            if (product) {
                handleShowProductDetails(product);
            } else {
                setShowDetails(false);
            }
        } else if (series) {
            setIsFiltered(true);
            const filtered = allProducts.filter(p => p.series === series && !p.hidden && !p.sold);
            setFilteredInventory(filtered);
            setShowDetails(false);
        } else if (category) {
            setIsFiltered(true);
            const filtered = allProducts.filter(p => p.category === category && !p.sold);
            setFilteredInventory(filtered);
            setShowDetails(false);
        } else {
            setIsFiltered(false);
            setShowDetails(false);
            const filtered = allProducts.filter(p =>
                (!p.hidden || (user && p.hidden)) && !p.sold
            );
            setFilteredInventory(sortProducts(filtered, 'newest'));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search, allProducts, user]);
    

    // effect to handle sorting
    useEffect(() => {
        const nextInventory = [...filteredInventory]

        // Sort products by creation date (newest first)
        const groupedPhotos = nextInventory.sort((a, b) => {
            return getDateInMillis(b.createdAt) - getDateInMillis(a.createdAt);  // Newest first
        });

        setInventory(groupedPhotos);  // Wrap in array to maintain existing component structure
    }, [user, filteredInventory]);

    // effect to handle grouping by series
    useEffect(() => {
        const reducedSeries = inventory.reduce((acc, p) => {
            if(acc[p.series]) acc[p.series].push(p);
            else acc[p.series] = [p];
            return acc;
        }, {} as Record<string, IProductInfo[]>);

        // Sort products within each series (newest first)
        Object.values(reducedSeries).forEach(seriesArr => {
            seriesArr.sort((a, b) => getDateInMillis(b.createdAt) - getDateInMillis(a.createdAt));
        });

        // Sort the series themselves (newest first by first product)
        const sortedSeries = Object.values(reducedSeries).sort(
            (a, b) => getDateInMillis(b[0].createdAt) - getDateInMillis(a[0].createdAt)
        );

        setGroupedInventory(sortedSeries);
    }, [inventory]);


    function sortInventory(method: string) {
        // First, sort the products within each series
        const sortedGroups = groupedInventory.map(seriesArr => {
            // Copy the array to avoid mutating state
            const sortedSeries = [...seriesArr];
            switch (method) {
                case "newest":
                    sortedSeries.sort((a, b) => getDateInMillis(b.createdAt) - getDateInMillis(a.createdAt));
                    break;
                case "oldest":
                    sortedSeries.sort((a, b) => getDateInMillis(a.createdAt) - getDateInMillis(b.createdAt));
                    break;
                case "low":
                    sortedSeries.sort((a, b) => a.price - b.price);
                    break;
                case "high":
                    sortedSeries.sort((a, b) => b.price - a.price);
                    break;
            }
            return sortedSeries;
        });
    
        // Then, sort the series themselves based on the first product in each group
        sortedGroups.sort((a, b) => {
            switch (method) {
                case "newest":
                    return getDateInMillis(b[0].createdAt) - getDateInMillis(a[0].createdAt);
                case "oldest":
                    return getDateInMillis(a[0].createdAt) - getDateInMillis(b[0].createdAt);
                case "low":
                    return a[0].price - b[0].price;
                case "high":
                    return b[0].price - a[0].price;
                default:
                    return 0;
            }
        });
    
        setGroupedInventory(sortedGroups);
    }
    useEffect(() => {
        sortInventory(sortBy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy])

    function handleSortChange(value: string) {
        setSortBy(value)
        setIsFiltered(value !== 'all');
        setShowSortModal(false)
    }

    function handleClearFilter() {
        setIsFiltered(false)
        setShowSortModal(false)
        const allVisibleProducts = allProducts.filter(p =>
            (!p.hidden || (user && p.hidden)) && !p.sold
        );
        setFilteredInventory(allVisibleProducts);
        setSortBy('newest')
    }

    function handleBack() {
        setProductToEdit(null)
        setShowDetails(false)
        setShowPhotoManager(false)
        navigate('/shop', { replace: true })
    }

    function handleShowProductDetails(product: IProductInfo) {
        setProductToEdit(product)
        setShowDetails(true)
        mainAppScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleCloseProductDetails() {
        setProductToEdit(null)
        setShowDetails(false)
        navigate('/shop', { replace: true })
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

    function handleFilterCategory(category: string) {
        setIsFiltered(true)
        setShowSortModal(false)
        setSelectedCategory(category)
    }

    async function handleSave(filesToUpload: IGeneralPhoto[]) {
        console.log("Photos Uploading: ", filesToUpload)
        setShowPhotoManager(false)
        await editProductDoc({ ...productToEdit, photos: filesToUpload })
    }

    function handleShowCartPopup(product: IProductInfo) {
        setShowCartPopup(true)
        setProductAddedName(product.title)
    }

    if (showDetails) {
        return <ProductDetails
            handleAddToCart={handleShowCartPopup}
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

        {showCartPopup && <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1001] p-8">
            <div className="flex flex-col justify-center items-center gap-2 bg-white bg-opacity-90 p-4 rounded-xl w-full">
                You've added <span className="font-retro text-xl bg-white px-2 w-[12rem] rounded-md text-center">{productAddedName}</span> to your cart!
                <button className="bg-edcYellow-60 text-white p-2 rounded-md w-[12rem]" onClick={() => navigate('/cart', { replace: true })}>Go to Cart!</button>
                <button className="bg-edcPurple-60 text-white p-2 rounded-md w-[12rem]" onClick={() => setShowCartPopup(false)}>Keep Shoppin</button>
            </div>
        </div>}

        {showSortModal ? <div className="fixed w-full h-[15rem] bg-edcPurple-80 text-white z-[1000] flex justify-around items-center bottom-0 border-t-2 border-white">
            <div 
                className="md:text-3xl text-lg hover:cursor-pointer font-retro rotate-[-10deg] border-2 border-edcYellow-40 border-dashed rounded-xl p-2 mb-8 md:mb-0 md:p-8 bg-edcPurple-60"
                onClick={() => handleFilterCategory("upcycled")}>
                    Upcycled</div>
            <div className="flex flex-col justify-center items-center w-fit h-full ">
                <div className="w-full mb-2 flex justify-center items-center p-2 mt-4" onClick={() => setShowSortModal(false)}>
                    Close <IoIosArrowDown className="w-8 h-8 rounded-full" />

                </div>
                <div className="flex flex-col justify-evenly items-center w-fit h-full gap-2">
                    <select 
                        className="border-2 border-white text-center rounded-md text-black min-w-[10rem]"
                        onChange={(e) => handleSortChange(e.target.value)} value={sortBy}>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="high">Price: high-low</option>
                        <option value="low">Price: low-high</option>
                        {/* <option value="series">Series</option> */}
                    </select>
                            
                    {isFiltered && <button onClick={() => handleClearFilter()}
                    className="bg-edcYellow-40 px-2 rounded-md text-black w-full">
                    Show ALL products</button>}
                        </div>
            </div>
            <div 
                className="md:text-3xl text-lg hover:cursor-pointer font-retro rotate-[10deg] border-2 border-edcYellow-40 border-dashed rounded-full p-2 mb-8 md:mb-0 md:p-8 bg-edcPurple-60"
                onClick={() => handleFilterCategory("handmade")}>
                Handmade</div>

            
            </div> : <div className="text-xl text-white fixed bottom-0 z-[1000] w-full bg-edcPurple-80 flex justify-center items-center gap-2 py-2 border-t-2 border-white" 
            onClick={() => setShowSortModal(true)} >
                Sort <IoIosArrowUp className="w-8 h-8 border-2 border-black rounded-lg" />
            </div>
        }

        <div className="w-full min-h-screen flex flex-col items-center">
            {!showDetails && <h1 className="text-white text-2xl md:text-3xl font-bold text-center py-4 drop-shadow-lg w-full">Shop</h1>}
            {showProductForm && <NewProductForm onClose={() => setShowProductForm(false)} />}
            {showEditProductForm && <EditProductForm onClose={() => setShowEditProductForm(false)} product={productToEdit} />}

            <div className="w-full flex flex-wrap justify-center">

                {user && <div className="w-[20rem]">
                    <AddProductCard addProduct={() => setShowProductForm(true)} />
                </div>}

                {groupedInventory.map((series) => (
                    <div key={series[0].series} className="w-screen text-white flex flex-wrap justify-center items-center">
                        <p className="text-white bg-edcPurple-80 text-2xl w-full text-center">{series[0].series}</p>
                        <div className="w-full flex flex-wrap justify-center items-center bg-white bg-opacity-70 p-2 pb-[8rem]">
                        {series.map((product) => (
                            <Frame key={product.id} additionalClass="w-[10rem] md:w-[15rem] h-fit relative m-2">
                                <p className={`${product.title.length > 11 ? "text-lg" : "text-2xl"} text-edcPurple-80 w-full text-center`}>
                                    {product.title}
                                </p>
                                <div className="flex flex-col justify-between items-center h-full w-full">
                                    <Carousel product={product} onClick={() => handleShowProductDetails(product)} />
                                    {user && (
                                        <AdminButtons
                                            hidden={product.hidden}
                                            hideProduct={() => hideProduct(product)}
                                            handleEdit={() => handleEdit(product)}
                                            addPhotoToSeries={() => handleAddPhotoToSeries(product)}
                                        />
                                    )}
                                    <ShoppingButtons
                                        setShowCartPopup={() => handleShowCartPopup(product)}
                                        product={product}
                                    />
                                </div>
                            </Frame>
                        ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
    );
}