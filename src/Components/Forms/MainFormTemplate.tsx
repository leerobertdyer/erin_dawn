import { IGeneralPhoto } from "../../Interfaces/IPhotos";
import { IProductInfo } from "../../Interfaces/IProduct";
import { IoIosArrowBack, IoIosRefresh, IoIosTrash } from "react-icons/io";

interface IMainFormTemplate {
    product?: IProductInfo;
    handleClickBack: () => void;
    resetState: () => void;
    handleDelete?: (product: IProductInfo, photo: IGeneralPhoto) => void; 
    children: React.ReactNode;
    bigger?: boolean;
}

export default function MainFormTemplate({ product, handleClickBack, resetState, handleDelete, children, bigger }: IMainFormTemplate) {
    return (
        <div className="flex flex-col items-center w-full h-screen bg-white fixed z-[1000] overflow-hidden">
            {/* Main content area with scrolling */}
            <div className={`flex-1 overflow-y-auto  pb-[5rem] max-h-[calc(100vh-5rem)] ${bigger ? 'w-[90vw]' : 'w-[85vw] md:w-[65vw]'}`}>
                <div className="flex flex-col gap-8 w-full justify-center items-center p-4">
                    {children}
                </div>
            </div>

            {/* Fixed button container at bottom */}
            <div className="fixed bottom-0 left-0 right-0 h-[5rem] bg-white">
                <div className="w-[20rem] mx-auto px-4 h-full flex justify-between items-center gap-4">
                    <button 
                        type="button"
                        onClick={() => handleClickBack()} 
                        className="p-2 bg-white hover:bg-edcPurple-80 hover:text-white border-2 border-edcPurple-80 text-edcPurple-80 rounded-md flex justify-around items-center w-24"
                    >
                        <IoIosArrowBack />
                    </button>

                    <button 
                        type="button" 
                        onClick={resetState}
                        className="bg-edcPurple-80 text-white w-24 hover:bg-white hover:border-2 hover:border-edcPurple-80 hover:text-black rounded-md flex p-2 justify-center items-center"
                    >
                        <IoIosRefresh />
                    </button>

                    {handleDelete && product && (
                        <button 
                            type="button" 
                            onClick={() => handleDelete(product, product.photos[0])} 
                            className="p-2 bg-rose-600 text-white rounded-md flex justify-around items-center w-24"
                        >
                            <IoIosTrash />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}