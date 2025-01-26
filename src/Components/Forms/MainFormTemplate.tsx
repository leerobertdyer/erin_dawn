import { IProductInfo } from "../../Interfaces/IProduct";
import { IoIosArrowBack, IoIosRefresh, IoIosTrash } from "react-icons/io";

interface IMainFormTemplate {
    product?: IProductInfo;
    handleClickBack: () => void;
    resetState: () => void;
    handleDelete?: (imageUrl: string, id: string) => void;
    children: React.ReactNode;
}
export default function MainFormTemplate({ product, handleClickBack, resetState, handleDelete, children }: IMainFormTemplate) {

    return (
        <div className="flex flex-col justify-center items-center w-full h-fit">
            <div className="flex flex-col gap-8 h-full w-full justify-center items-center">
                {children}
            </div>

            <div className="w-[100%] h-10 m-auto flex justify-center items-center gap-4 mt-4">
                <button type="button"
                    onClick={() => handleClickBack()} className="p-2 bg-blue-500 h-full text-white rounded-md flex justify-around items-center w-[20%]">
                    <IoIosArrowBack /></button>
                <button type="button" onClick={resetState}
                    className={'bg-yellow-400 text-black w-[20%] h-full rounded-md flex p-2 flex-col justify-center items-center '}>
                    <IoIosRefresh /></button>
                {handleDelete && product && <button type="button" onClick={() => handleDelete(product.imageUrl, product.id)} className="p-2 bg-rose-600 h-full text-white rounded-md flex justify-around items-center w-[20%] ">
                    <IoIosTrash /></button>}
            </div>

        </div>
    )
}