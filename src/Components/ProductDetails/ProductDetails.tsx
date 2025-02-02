import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { IProductInfo } from "../../Interfaces/IProduct";
import Carousel from "../Carousel/Carousel";

interface IProductDetails {
    product: IProductInfo[]
    handleCloseProductDetails: () => void
}

//TODO: Make it so you can view each photo larger

export default function ProductDetails({ product, handleCloseProductDetails }: IProductDetails) {
    const { cartProducts, setCartProducts } = useProductManagementContext();
    return (<div
        className="flex flex-col md:flex-row 
            justify-start items-center md:items-start gap-4
            w-[90%] m-auto p-4 border-y-2 mb-4 border-y-black">
        <Carousel
            photos={product.map(photo => ({ id: photo.id, url: photo.imageUrl, title: photo.title, itemOrder: photo.itemOrder ?? 0 }))} >
            <div className="flex justify-center w-full p-2 gap-2 text-edcPurple-80">
                <button onClick={handleCloseProductDetails}
                    className="p-2 bg-edcPurple-60 rounded-md text-white w-[8rem]">
                    Go Back
                </button>
                <button onClick={() => setCartProducts([...cartProducts, product[0]])}
                    className="p-2 bg-yellow-500 rounded-md w-[8rem]">
                    Add to Cart
                </button>
            </div>
        </Carousel>
        <div className="flex flex-col justify-start h-full w-full items-center rounded-md">
            <p className="text-xl p-2 w-full bg-gray-500 bg-opacity-35 rounded-md text-center">"{product[0].title}"</p>
            <p className="text-xl p-2 w-full text-center">${product[0].price}<span className="text-xs">.00</span></p>
            <p className="text-lg p-6 w-[85%]  text-center bg-white rounded-md">{product[0].description}</p>
            <p className="text-lg p-2 w-full text-center">{product[0].size}</p>
        </div>
    </div>
    )
}