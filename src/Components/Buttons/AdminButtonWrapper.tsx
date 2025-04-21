import { FaRegEdit } from "react-icons/fa";
import { IoIosAdd, IoIosArrowBack, IoIosArrowForward, IoIosCamera, IoIosEye, IoIosHand, IoIosKey, IoIosTrash } from "react-icons/io";

interface ICustomAdminButton {
    onclickFunction: () => void;
    content: string;
}

interface ButtonContent {
    text: string;
    icon: JSX.Element;
}

export default function AdminButtonWrapper({ onclickFunction, content }: ICustomAdminButton) {
    const getButtonContent = (): ButtonContent => {
        switch (content.toUpperCase()) {
            case 'SERIES':
                return { text: 'Photos', icon: <IoIosCamera /> };
            case 'REMOVE':
            case 'DELETE':
                return { text: 'Del', icon: <IoIosTrash /> };
            case 'HIDE':
                return { text: 'Hide', icon: <IoIosHand /> };
            case 'SHOW':
                return { text: 'Show', icon: <IoIosEye /> };
            case 'ADD':
                return { text: 'Add', icon: <IoIosAdd /> };
            case 'EDIT':
                return { text: 'Edit', icon: <FaRegEdit /> };
            case 'KEY':
                return { text: '', icon: <IoIosKey /> };
            case 'RIGHT':
                return { text: '', icon: <IoIosArrowForward /> };
            case 'LEFT':
                return { text: '', icon: <IoIosArrowBack /> };
            default:
                return { text: content, icon: null };
        }
    };

    const { text, icon } = getButtonContent();

    return (
        <button 
            className="transition-all duration-[10ms] bg-edcPurple-60 text-white text-xs px-2 rounded-md w-fit md:w-full h-[1.5rem]"
            onClick={onclickFunction}
        >
            <div className="flex justify-center items-center gap-2">
                <span className={`${content === 'Add Product' ? '' : 'hidden md:block'}`}>{text}</span>
                <span className="">{icon}</span>
            </div>
        </button>
    );
}