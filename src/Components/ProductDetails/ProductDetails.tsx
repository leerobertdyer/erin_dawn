import Frame from "../Frame/Frame";
import { IProductInfo } from "../../Interfaces/IProduct";

interface IProductDetails {
    product: IProductInfo[]
    handleCloseProductDetails: () => void
}

//TODO: Make it so you can view each photo larger
//TODO: Make the cart button actually add to a global cart state
//TODO: Find out what details we need to show: SIZE, PRICE, MATERIAL, DESCRIPTION...

export default function ProductDetails({ product, handleCloseProductDetails }: IProductDetails) {
    return (<div className="flex flex-col w-[90%] h-full justify-start items-center gap-4 border-2 border-black rounded-md p-2">
        <p>{product[0].title}</p>

        <div className="w-full h-fit bg-white flex flex-col md:flex-row justify-center items-center gap-[1rem] overflow:hidden">
            {product.map((photo) =>
                <div key={photo.id} className="w-[10rem] bg-red-400">
                    <Frame
                        additionalClass="w-[10rem]"
                        u={null}
                        id={photo.id} >
                        <img src={photo.imageUrl} alt={photo.title} className="rounded-md" />
                    </Frame>
                </div>
            )}
        </div>
        <p>{product[0].description}</p>
        <div className="flex justify-center w-full p-2 gap-2 text-edcPurple-80">
            <button className="p-2 bg-edcPurple-60 rounded-md text-white w-[8rem]" onClick={handleCloseProductDetails}>Go Back</button>
            <button className="p-2 bg-edcPurple-60 rounded-md text-white w-[8rem]">Add to Cart</button>
        </div>
    </div>
    )
}