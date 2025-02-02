import { User } from "firebase/auth";
import Frame from "../Frame/Frame";
import AdminButtons from "../Buttons/AdminButtons";
import { usePhotosContext } from "../../Context/PhotosContext";
import { useNavigate } from "react-router-dom";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";

export default function Main({ u }: { u: User | null }) {
    const { allPhotos } = usePhotosContext();
    const { setProduct, setFilteredInventory } = useProductManagementContext();

    const navigate = useNavigate();

    const mainPagePhotos = allPhotos.filter(p => p.tags.includes("mainPage"));

    function handleEdit(id: string) {
        setProduct(allPhotos.find(p => p.id === id));
        navigate('/edit-category');
    }
    function handleCategoryClick(category: string) {
        const filteredPhotos = allPhotos.filter(p => p.category === category);
        setFilteredInventory(filteredPhotos);
        const urlWithParams = '/shop?category=' + encodeURIComponent(category);
        console.log(urlWithParams)
        navigate(urlWithParams);
    }

    return (
        <div className="w-full h-fit bg-white bg-opacity-80 py-8 px-4 flex-wrap border-y-4 border-yellow-400 border-double border-opacity-40 flex flex-col sm:flex-row justify-center items-center gap-[4rem]">
            {mainPagePhotos.map((mpPhoto, key) => (
                <Frame key={key} additionalClass="w-[87vw] md:w-[40vw] lg:w-[35vw] h-fit max-h-[65rem] max-w-[55rem]" hover={true}>
                    <div className="h-[70vh] w-full" onClick={() => handleCategoryClick(mpPhoto.category)}>
                        <img src={mpPhoto.imageUrl} alt={mpPhoto.title} className="rounded-md h-full w-full object-cover object-center" />
                    </div>
                    <button className="text-center text-lg">{mpPhoto.category}</button>
                    {u && <AdminButtons handleEdit={() => handleEdit(mpPhoto.id)} />}
                </Frame>
            ))}
        </div>
    );
}