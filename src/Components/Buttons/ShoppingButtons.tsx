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
        if (cartProducts.includes(product)) {
            setIsInCart(true)
        } else {
            setIsInCart(false)
        }
    }, [cartProducts])

    function handleAddToCart(product: IProductInfo) {
        setCartProducts([...cartProducts, product])
    }

    function handleRemoveFromCart(product: IProductInfo) {
        const newCart = cartProducts.filter(p => p !== product)
        setCartProducts(newCart)
    }

    return (
        <div className="flex flex-col justify-center items-center w-full p-2 gap-2">
            <div className="flex justify-around w-full bg-white p-2 rounded-md text-edcPurple-80">
                <p>{product.series}</p>
                <p className="font-retro rotate-6 text-2xl">${product.price}<span className="text-xs">.00</span></p>
            </div>
            {handleDetails && <button
                className="
                            transition:all duration-[10ms]
                            hover:bg-yellow-500 
                            bg-edcPurple-60 text-white px-2 rounded-md w-[100%]"
                onClick={() => handleDetails(Number(product.seriesOrder) - 1)}
            >Details</button>}
            <button

                className={` 
                    ${isInCart
                        ? "bg-red-400"
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