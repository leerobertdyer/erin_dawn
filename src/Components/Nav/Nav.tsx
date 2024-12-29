import { IoIosMenu } from "react-icons/io";

export default function Nav() {
    return (
        <div className="
        w-full h-[13vh] md:h-[15vh] 
        flex justify-between items-center 
        py-0 px-[1rem] md:px-[4rem] 
        bg-white">
            <IoIosMenu size={50} />
            <div className="text-right">
                <h1 className="font-retro text-[1.5rem] md:text-[2.5rem] m-0 p-0">ERIn DaWn cAmPbELl</h1>
                <h2 className="text-[.5rem] md:text-[1rem] text-gray-400 m-0 md:pb-4">Handmade Clothing & Upcycled Vintage</h2>
            </div>
        </div>
    )
}

/* 
 width: 100vw;
height: 13vh;
display: flex;
justify-content: space-between;
align-items: center;
padding: 0 4rem;
background-color: white;

*/