import Frame from "../Frame/Frame";
import { IProductInfo } from "../../Interfaces/IProduct";

export default function ProductDetails( product: IProductInfo[] ) {
    return (
        <div className="w-screen h-screen bg-white flex flex-col md:flex-row justify-center items-center gap-[1rem] overflow:hidden">
           { product.map((photo) => 
            <Frame  key={photo.id} 
                    src={photo.imageUrl} 
                    alt={photo.title} 
                    additionalClass="w-[19rem]" 
                    u={null} 
                    id={photo.id} />
           )}
        </div>
    )
}