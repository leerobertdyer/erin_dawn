import { HiOutlineShoppingCart } from "react-icons/hi2";
import { Link } from "react-router-dom";

interface ICartAndNumber {
    iconSize: number
    cartLength: number
}
export default function CartIconAndNumber({ iconSize, cartLength }: ICartAndNumber) {

    return (
        <div className="relative w-full h-full">
            <Link to="/cart" className="flex flex-col justify-center items-center">

                <HiOutlineShoppingCart size={iconSize} className="absolute w-fit inline" />
                {cartLength > 0 && <span className="absolute bottom-0 
                    text-white bg-black p-[2px] 
                    rounded-full w-[25px] h-[25px] flex justify-center items-center">{cartLength}</span>}
            </Link>
        </div>
    )
}