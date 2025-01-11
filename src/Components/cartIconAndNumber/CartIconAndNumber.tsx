import { HiOutlineShoppingCart } from "react-icons/hi2";
import { Link } from "react-router-dom";

interface iParams {
    iconSize: number
    cartIds: string[]
}
export default function CartIconAndNumber({ iconSize, cartIds }: iParams) {

    return (
        <div className="relative w-fit h-fit">
            <Link to="/shop" className="flex flex-col justify-center items-center">

                <HiOutlineShoppingCart size={iconSize} className="absolute w-fit inline"
                    onClick={() => console.log('cart!')} />
                {cartIds.length > 0 && <span className="absolute bottom-0 
                    text-white bg-black p-[2px] 
                    rounded-full w-[25px] h-[25px] flex justify-center items-center">{cartIds.length}</span>}
            </Link>
        </div>
    )
}