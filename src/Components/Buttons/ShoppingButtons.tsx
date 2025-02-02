import { useEffect, useState } from "react";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { IProductInfo } from "../../Interfaces/IProduct";

interface IShoppingButons {
    product: IProductInfo,
    handleDetails?: (index: number) => void
}
export default function ShoppingButtons({ product, handleDetails }: IShoppingButons) {
    const { setCartProducts, cartProducts } = useProductManagementContext();
    const [isInCart, setIsInCart] = useState(false)

    useEffect(() => {
        console.log('cart changed in shoppingButtons')
        setIsInCart(cartProducts.some(p => p.id === product.id));
    }, [cartProducts, product.id])

    function handleAddToCart(product: IProductInfo) {
        const nextProducts = [...cartProducts, product]
        setCartProducts(nextProducts)
    }

    function handleRemoveFromCart(product: IProductInfo) {
        const newCart = cartProducts.filter(p => p.id !== product.id)
        setCartProducts(newCart)
    }

    return (
        <div className="flex flex-col justify-center items-center w-full p-2 gap-4">
            <div className="flex justify-around w-full bg-white p-2 rounded-md text-edcPurple-80">
                <p>{product.itemName}</p>
                <p className="font-retro rotate-6 text-2xl">${product.price}<span className="text-xs">.00</span></p>
            </div>
            {handleDetails && <button
                className="
                            transition:all duration-[10ms]
                            hover:bg-yellow-500 
                            bg-edcPurple-60 text-white px-2 rounded-md w-[100%]"
                onClick={() => handleDetails(Number(product.itemOrder) - 1)}
            >Details</button>}
            <button

                className={` 
                    ${isInCart
                        ? "bg-rose-600"
                        : "bg-edcPurple-60 hover:bg-yellow-500"}
                    transition:all duration-[10ms]
                    text-white px-2 rounded-md w-[100%]`}
                onClick={isInCart
                    ? () => handleRemoveFromCart(product)
                    : () => handleAddToCart(product)}
            >{isInCart
                ? "Remove From Cart"
                : "Add to Cart"}
            </button>
        </div>
    )
}