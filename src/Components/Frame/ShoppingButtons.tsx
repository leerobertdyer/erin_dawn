import { IProductInfo } from "../../Interfaces/IProduct";

export default function ShoppingButtons({ product, handleDetails }: { product: IProductInfo, handleDetails: () => void }) {
    return (
        <div className="flex flex-col justify-center items-center w-full p-2 gap-2">
            <div className="flex justify-around w-full bg-edcPurple-LIGHTER p-2 rounded-md text-edcPurple-DARK">
                <p>{product.series}</p>
                <p>${product.price}</p>
            </div>
            <button
                className="
                            transition:all duration-[10ms]
                            hover:bg-yellow-500 
                            bg-edcPurple-BASE text-white px-2 rounded-md w-[100%]"
                            onClick={handleDetails}
                            >Details</button>
            <button
                className="
                            transition:all duration-[10ms]
                            hover:bg-yellow-500 
                            bg-edcPurple-LIGHT text-white px-2 rounded-md w-[100%]">Add to Cart</button>
        </div>
    )
}