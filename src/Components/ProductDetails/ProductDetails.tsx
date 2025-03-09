import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { IProductInfo } from "../../Interfaces/IProduct";
import { KEEPING_IT_CLEAN, KEEPING_IT_CLEAN_DETAILS } from "../../util/constants";
import Carousel from "../Carousel/Carousel";

interface IProductDetails {
    product: IProductInfo[]
    handleCloseProductDetails: () => void
}

//TO DO: Make it so you can view each photo larger

export default function ProductDetails({ product, handleCloseProductDetails }: IProductDetails) {
    const { cartProducts, setCartProducts } = useProductManagementContext();
    return (<div
        className="flex flex-col lg:flex-row 
            justify-start items-center lg:items-start gap-4
            w-[90%] min-h-fit m-auto p-4 border-y-2 mb-4 border-y-black">
                <div className="w-full lg:w-1/2 max-w-[650px]">
                    <Carousel
                        photos={product.map(photo => ({ id: photo.id, url: photo.imageUrl, title: photo.title, tags: photo.tags, itemOrder: photo.itemOrder ?? 0 }))} >
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
            </div>
        <div className="flex flex-col justify-between h-full max-w-[35rem] mx-auto border-edcPurple-80 border-2 bg-edcPurple-20 items-center rounded-md ">
            <p className="text-xl p-2 w-full bg-edcPurple-80 bg-opacity-35 rounded-t-md text-white text-center border-b-2 border-black">"{product[0].title}"</p>
            <p className="text-xl p-2 w-full text-center">${product[0].price}<span className="text-xs">.00</span></p>
            <p className="text-lg p-6 w-[85%] bg-white rounded-md whitespace-pre-line max-h-[550px] overflow-y-auto border-2 border-black">{product[0].description}</p>
            <p className="text-lg px-2 my-2 w-fit text-center bg-white rounded-md border-2 border-black">Size: {product[0].size}</p>
            <p className="text-lg px-2 my-2 w-fit text-center bg-white rounded-md border-2 border-black">Dimensions: {product[0].dimensions}</p>
            <div className="p-2 border-2 border-black rounded-md mb-4 p-2 w-[80%] m-auto bg-white">
                <p className="text-lg p-2 w-full text-center">{KEEPING_IT_CLEAN}</p>
                <p className="text-lg w-full text-center">{KEEPING_IT_CLEAN_DETAILS}</p>
            </div>
        </div>
    </div>
    )
}