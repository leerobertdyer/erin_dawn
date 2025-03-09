import { IoIosArrowBack, IoIosArrowForward, IoIosCamera, IoIosEye, IoIosHand, IoIosKey, IoIosTrash } from "react-icons/io"

interface ICustomAdminButton {
    onclickFunction: () => void
    content: string
}
export default function AdminButtonWrapper({ onclickFunction, content }: ICustomAdminButton) {
    return (
        <button className="
            transition:all duration-[10ms]
            hover:bg-yellow-500 hover:text-black
            bg-edcPurple-60 text-white px-2 rounded-md w-[100%] h-[1.5rem]"
            onClick={onclickFunction}>

            {content === "SERIES"
                ?
                <div className="flex justify-center items-center gap-2">
                    Add <IoIosCamera />
                </div>
                : content === "REMOVE" || content === "DELETE"
                    ?
                    <div className="flex justify-center items-center gap-2">
                        <IoIosTrash />
                    </div>
                    : content === "KEY"
                        ? <div className="flex justify-center items-center gap-2">
                            <IoIosKey />
                        </div>
                        : content === "LEFT"
                            ? <div className="flex justify-center items-center gap-2">
                                <IoIosArrowBack />Prev
                            </div>
                            : content === "RIGHT"

                                ? <div className="flex justify-center items-center gap-2">
                                    Next<IoIosArrowForward />
                                </div>
                                : content === "Hide Product"
                                    ? <div className="flex justify-center items-center gap-2">
                                        <IoIosHand />Hide
                                    </div>
                                    : content === "Show Product"
                                        ? <div className="flex justify-center items-center gap-2">
                                            <IoIosEye />Show
                                        </div>
                                        : content}

        </button>)
}
