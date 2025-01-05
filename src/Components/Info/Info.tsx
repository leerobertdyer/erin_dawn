import { useState } from "react";
import { IoIosInformation } from "react-icons/io";

interface iInfoProps {
    information: string;
}

//TODO: make this shit work right... the positioning is more difficult than I expected...

export default function Info({ information }: iInfoProps) {
    const [showInformation, setShowInformation] = useState(false);

    function handleOnMouseEnter() {
        setShowInformation(true);
    }
    function handleOnMouseLeave() {
        setShowInformation(false);
    }

    return (
        <div className="absolute top-[22%] right-[-4%] z-10">
            {showInformation
                ?
                <div className=" bg-gray-200 text-black text-xs rounded-md p-2 w-fit h-fit"
                onMouseLeave={handleOnMouseLeave}>
                    {information}
                </div>
                :
                <div className=" bg-yellow-200 text-black rounded-full w-fit h-fit"
                    onMouseEnter={handleOnMouseEnter}
                    >
                    <IoIosInformation size={25} />
                </div>
            }
        </div>
    )
}