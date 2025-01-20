import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { IProductInfo } from "../../Interfaces/IProduct";

interface ICartItem {
    item: IProductInfo
}
export default function CartItem({ item }: ICartItem) {
    const { setCartProducts, cartProducts }= useProductManagementContext();

    return (
        <div className="
        w-full h-[7rem]
        flex items-center justify-between 
        p-2 border-2 border-black rounded-md gap-2">
            <div className="overflow-hidden w-18 h-18 rounded-md">
            <img src={item.imageUrl} alt={item.title} className="w-20 h-20 object-cover object-center" />
            </div>
            <p className="font-retro rotate-6 text-2xl">${item.price}<span className="text-xs">.00</span></p>
            <div className="flex flex-col items-end justify-center gap-2">
                <h1>"{item.title}"</h1>
                <button className=" bg-rose-600 text-white p-1 rounded-md"
                onClick={() => setCartProducts(cartProducts.filter(product => product.id !== item.id))}>Remove</button>
            </div>
        </div>
    )
}