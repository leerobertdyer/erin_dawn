import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { IProductInfo } from "../../Interfaces/IProduct";

interface ICartItem {
    item: IProductInfo
}
export default function CartItem({ item }: ICartItem) {
    const { setCartProducts, cartProducts }= useProductManagementContext();

    return (
        <div className="
        w-full h-fit
        flex flex-col items-center justify-between 
        p-2 border-2 border-black rounded-md gap-4 bg-cover bg-center"
        style={{ backgroundImage: `url(${item.photos[0].url})` }}>
            <p className="bg-white border-2 border-black px-2 rounded-md font-retro rotate-6 text-2xl ">${Number(item.price).toFixed(2)}</p>
            <div className="flex flex-col items-center justify-center gap-4">
                <p className="bg-white border-2 border-black p-2 rounded-md text-wrap w-full text-center font-semibold text-lg">"{item.title}"</p>
                <button className="bg-rose-600 text-white p-1 rounded-md"
                onClick={() => setCartProducts(cartProducts.filter(product => product.id !== item.id))}>Remove</button>
            </div>
        </div>
    )
}