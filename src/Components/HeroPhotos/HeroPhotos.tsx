
import Frame from "../Frame/Frame";
import LoadPhotos from "./LoadPhotos";
import { IProductInfo } from "../../Interfaces/IProduct";
import { User } from "firebase/auth";
import AdminButtons from "../Buttons/AdminButtons";
import ProductForm from "../ProductForm/ProductForm";
import { IProductMgmt } from "../../Interfaces/IProductMgmt";

interface IPhotos extends IProductMgmt {
    u: User | null
    allPhotos: IProductInfo[]
    isLoading: boolean
}
export default function HeroPhotos({ u, product, isEditing, handleEdit, handleDelete, updateProduct, handleFinishEdit, allPhotos, isLoading }: IPhotos) {
    const photos = allPhotos.filter(photo => photo.tags.includes("hero"))

    //TODO: for the phone version, make the photos scrollable

    return (
        <div className={`
            w-[100vw] ${isEditing ? "h-fit" : "h-[45vh] overflow-hidden"} 
            flex justify-center items-center
            `}>
            {isLoading ? <LoadPhotos />
                : isEditing ? <ProductForm product={product} handleDelete={handleDelete} handleEdit={handleEdit} handleFinishEdit={handleFinishEdit} updateProduct={updateProduct} />
                    : photos.length > 0 &&
                    photos.map((photo, key) => {
                        return (
                            <div key={key} className="
                                    flex-shrink-0
                                    w-[10rem] md:w-[12rem] lg:w-[14rem] p-4 h-full">
                                <Frame >
                                    <img src={photo.imageUrl} alt={photo.title} className="rounded-md h-full w-auto object-cover object-center" />
                                    {u && <AdminButtons handleEdit={() => handleEdit(photo.id)} />}
                                </Frame>
                            </div>
                        )
                    })
            }
        </div>
    )
}