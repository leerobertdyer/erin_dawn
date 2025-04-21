import Frame from "../Frame/Frame";
import AdminButtons from "../Buttons/AdminButtons";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { useUserContext } from "../../Context/UserContext";
import { useEffect, useState } from "react";
import { ICategory } from "../../Interfaces/ICategory";
import { useNavigate } from "react-router-dom";
import EditCategoryForm from "../Forms/EditCategoryForm";
import { IProductInfo } from "../../Interfaces/IProduct";


export default function Main() {
    const { user } = useUserContext();
    const { allCategories } = useProductManagementContext();
    const { allProducts, setFilteredInventory } = useProductManagementContext();
    
    const navigate = useNavigate();

    const [showEditCategoryDialog, setShowEditCategoryDialog] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<ICategory | null>(null);
    const [series, setSeries] = useState<IProductInfo[]>([]);

    useEffect(() => {
        const uniqueSeries = []
        allProducts.forEach(p => {
            if (!uniqueSeries.some(s => s.series === p.series)) {
                if (!p.hidden && !p.sold) {
                    uniqueSeries.push(p);
                }
            }
        })
        console.log("UNIQUE SERIES", uniqueSeries)
        setSeries(uniqueSeries);
    }, [allProducts])
    function handleEdit(category: ICategory) {
        setShowEditCategoryDialog(true);
        setCategoryToEdit(category);
    }

    function handleClose() {
        setShowEditCategoryDialog(false);
        setCategoryToEdit(null);
    }

    function handleCategoryClick(category: string) {
        const filteredProducts = allProducts.filter(p => p.category === category);
        setFilteredInventory(filteredProducts);
        const urlWithParams = '/shop?category=' + encodeURIComponent(category);
        console.log(urlWithParams)
        navigate(urlWithParams);
    }

    function handleSeriesClick(series: string) {
        const filteredProducts = allProducts.filter(p => p.series === series && !p.hidden && !p.sold);
        setFilteredInventory(filteredProducts);
        const urlWithParams = '/shop?series=' + encodeURIComponent(series);
        console.log(urlWithParams)
        navigate(urlWithParams);
    }

    return (
        <div className="w-full h-fit bg-white bg-opacity-80 py-8 px-4 flex-wrap border-y-4 border-yellow-400 border-double border-opacity-40 flex flex-col sm:flex-row justify-center items-center gap-[2rem]">
            <h1 className="w-full text-center text-white bg-[#242424] rounded-md bg-opacity-30 text-[2rem] sm:text-[3.5rem] p-0 m-0">Shop by Series</h1>
            <div className="w-full h-fit flex flex-wrap justify-center items-center gap-[1rem]">
            {series.map((s, key) => (
                <Frame key={key} additionalClass="w-[10rem] m:w-[12rem] h-[13rem] md:h-[14rem] overflow-hidden pb-6" hover={true}>
                    <div className="h-[8rem] w-[8rem]" onClick={() => handleSeriesClick(s.series)}>
                        <img src={s.photos[0].url} alt={s.series} className="rounded-md h-full w-full object-cover object-center" />
                    </div>
                    <p className="text-center text-sm" >{s.series}</p>
                </Frame>
            ))}
            </div>
            {showEditCategoryDialog && <EditCategoryForm categoryToEdit={categoryToEdit} onClose={handleClose} />}
            <h2 className="w-full text-center text-white bg-[#242424] rounded-md bg-opacity-30 text-[2rem] sm:text-[3.5rem] p-0 m-0">Shop by Category</h2>
            {allCategories.map((c, key) => (
                <Frame key={key} additionalClass="w-[87vw] md:w-[40vw] lg:w-[35vw] h-fit max-h-[65rem] max-w-[55rem]" hover={true}>
                    <div className="h-[70vh] w-full" onClick={() => handleCategoryClick(c.name)}>
                        <img src={c.url} alt={c.name} className="rounded-md h-full w-full object-cover object-center" />
                    </div>
                    <button className="text-center text-2xl tracking-[.2rem] font-retro">{c.name}</button>
                    {user && <AdminButtons handleEdit={() => handleEdit(c)} />}
                </Frame>
            ))}
        </div>
    );
}