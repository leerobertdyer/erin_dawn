import { User } from "firebase/auth";
import { IProductInfo } from "../../Interfaces/IProduct";
import Frame from "../Frame/Frame";

interface IParams {
    products: IProductInfo[];
    u: User | null;
    handleBack: () => void;
}
export default function BatchEdit({ products, u, handleBack }: IParams) {
    return (
        <div className="fixed top-0 left-0 z-10 w-screen min-h-full py-[4rem] bg-blue-400 flex flex-col items-center">
            <div className="flex flex-col md:flex-row justify-center items-center gap-[1rem]">
                {products.map((product) => <Frame key={product.id} u={u} src={product.imageUrl} id={product.id} />)}
            </div>
            <button onClick={handleBack} className="w-[10rem] m-auto bg-white text-black p-2 rounded-md">Back</button>
        </div>
    )
}