import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { IProductInfo } from "../../Interfaces/IProduct";
import { KEEPING_IT_CLEAN, KEEPING_IT_CLEAN_DETAILS } from "../../util/constants";
import Carousel from "../Carousel/Carousel";

interface IProductDetails {
    product: IProductInfo
    handleCloseProductDetails: () => void
}

//TODO: Make it so you can view each photo larger

export default function ProductDetails({ product, handleCloseProductDetails }: IProductDetails) {
    const { cartProducts, setCartProducts } = useProductManagementContext();
    return (<div
        className="flex flex-col lg:flex-row 
            justify-start items-center lg:items-start gap-4
            w-[95%]  m-auto p-4 border-y-2 mb-4 border-y-black">
                <div className="w-full lg:w-1/2 max-w-[650px]">
                    <Carousel
                        product={product}>
                        <div className="flex justify-center w-full p-2 gap-2 text-edcPurple-80">
                            <button onClick={handleCloseProductDetails}
                                className="p-2 bg-edcPurple-40 rounded-md text-white w-[8rem]">
                                Go Back
                            </button>
                            <button onClick={() => setCartProducts([...cartProducts, product])}
                                className="p-2 bg-edcYellow-40 rounded-md w-[8rem] border-2 border-edcPurple-60">
                                Add to Cart
                            </button>
                        </div>
                    </Carousel>
            </div>
        <div className="flex flex-col justify-between h-full mx-auto max-w-[650px] border-edcPurple-80 border-2 bg-edcBlue-10 items-center rounded-md ">
            <p className="text-3xl p-2 w-full bg-edcPurple-40 rounded-t-sm text-white text-center border-b-2 border-black">"{product.title}"</p>
            <p className="text-xl p-2 w-full text-center">${product.price}<span className="text-xs">.00</span></p>
            <p className="text-lg p-6 w-[85%] bg-white rounded-md whitespace-pre-line max-h-[550px] overflow-y-auto border-2 border-black text-center">{product.description}</p>
            <p className="text-lg px-2 my-2 w-[85%] text-center bg-white rounded-md border-2 border-black">Size: <br />
                <div className="bg-gray-300 px-2 rounded-md mb-2 w-fit m-auto">
                    {product.size.toUpperCase()}
                </div>
            </p>
            <p className="text-lg px-2 my-2 w-[85%] text-center bg-white rounded-md border-2 border-black">Dimensions: <br />
                <div className="bg-gray-300 px-2 rounded-md mb-2 text-md ">
                    {product.dimensions}
                </div>
            </p>
            <div className="border-2 border-black rounded-md mb-4 p-2 w-[85%] m-auto bg-white">
                <p className="text-lg p-2 w-full text-center">{KEEPING_IT_CLEAN}</p>
                <p className="text-lg w-full text-center bg-gray-300 p-2 rounded-md mb-2">{KEEPING_IT_CLEAN_DETAILS}</p>
            </div>
        </div>
    </div>
    )
}