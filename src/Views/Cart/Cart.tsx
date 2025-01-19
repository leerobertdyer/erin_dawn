import ShoppingButtons from "../../Components/Buttons/ShoppingButtons";
import Frame from "../../Components/Frame/Frame";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";

export default function Cart() {

    const { cartProducts } = useProductManagementContext();

    return (
        <div className="
        w-full h-fit
        p-[2rem]
        md:w-[35vw] md:min-h-screen 
        bg-edcBlue-20 
        flex flex-col items-start justify-start">    
            {cartProducts.map((product, key) =>
            <Frame key={key} additionalClass="border-0 bg-red-400 p-2">
                <div className="w-[6rem] md:w-[8rem] lg:w-[10rem] ">
                    <img src={product.imageUrl} alt={product.title} />
                    <ShoppingButtons product={product} />
                </div>
                </Frame>
            )}
        </div>
    )
}