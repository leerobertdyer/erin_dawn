import { useEffect, useState } from "react";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { IProductInfo } from "../../Interfaces/IProduct";
import { addToCart_GA } from "../../util/analytics";

interface IShoppingButons {
    product: IProductInfo,
    setShowCartPopup: (show: boolean) => void
}
export default function ShoppingButtons({ product, setShowCartPopup }: IShoppingButons) {
    const { setCartProducts, cartProducts } = useProductManagementContext();
    const [isInCart, setIsInCart] = useState(false)


    useEffect(() => {
        setIsInCart(cartProducts.some(p => p.id === product.id));
    }, [cartProducts, product.id])

    function handleAddToCart(product: IProductInfo) {
        const nextProducts = [...cartProducts, product]
        setCartProducts(nextProducts)
        addToCart_GA({ id: product.id, title: product.title, price: product.price });
        setShowCartPopup(true);
    }

    function handleRemoveFromCart(product: IProductInfo) {
        const newCart = cartProducts.filter(p => p.id !== product.id)
        setCartProducts(newCart)
    }

  return (
        <div className="flex flex-col justify-center items-center w-full pb-2 px-2 gap-2">
            <div className="flex justify-around items-center w-full flex-wrap gap-2 bg-white p-0 rounded-md text-edcPurple-80">
                <p className="font-retro text-2xl">${product.price}<span className="text-xs">.00</span></p>
            </div>
            <button
                className={` 
                    ${isInCart
                        ? "bg-rose-600"
                        : "bg-edcPurple-60 hover:bg-edcYellow-40"}
                    transition:all duration-[10ms]
                    text-white px-2 rounded-md w-[100%]`}
                onClick={isInCart
                    ? () => handleRemoveFromCart(product)
                    : () => handleAddToCart(product)}
            >{isInCart
                ? "Remove"
                : "Add to Cart"}
            </button>
        </div>
    )
}