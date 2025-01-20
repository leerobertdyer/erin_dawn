import { IProductInfo } from "../../Interfaces/IProduct";
import Frame from "../Frame/Frame";
import AdminButtons from "../Buttons/AdminButtons";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";

interface IBatchEdit {
    products: IProductInfo[];
    handleBack: () => void;
}
export default function BatchEdit({ products, handleBack }: IBatchEdit) {
    const { handleEdit } = useProductManagementContext();
    return (
        <div className="fixed top-0 left-0 z-10 w-screen min-h-full py-[2rem] bg-white flex flex-col items-center">
            <div className="flex flex-col md:flex-row justify-center items-center gap-[1rem]">
                {products.map((product) =>
                    <Frame key={product.id} additionalClass="w-[10rem]">
                        <img src={product.imageUrl} id={product.id} className="rounded-md"/>
                        <AdminButtons handleEdit={() => handleEdit(product.id)} />
                    </Frame>
                )}
            </div>
            <button onClick={handleBack} className="w-[10rem] m-auto bg-white text-black p-2 rounded-md">Back</button>
        </div>
    )
}