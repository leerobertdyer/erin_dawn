import { useState } from "react";
import { IoIosCart, IoIosMenu } from "react-icons/io";
import { Link } from "react-router";

export default function Nav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
        {isOpen && <div className="w-full h-screen bg-black bg-opacity-50 fixed top-0 left-0 z-50"
         onClick={() => setIsOpen(false)}>
            
            <div className="flex justify-center items-center h-full">
                <div className="flex flex-col 
                justify-evenly items-center 
                bg-black bg-opacity-35 
                w-[80vw] h-[80vh]
                md:w-[40vw] md:h-[60vh]
                rounded-md">
                    <button className="text-white text-[2rem]">X</button>
                    <Link to="/" className="text-white text-[2rem]">Home</Link>
                    <Link to="/shop" className="text-white text-[2rem]">Shop</Link>
                    <Link to="/about" className="text-white text-[2rem]">About</Link>
                </div>
            </div>
            </div>}
            <div className="
        w-full h-[13vh] md:h-[15vh] 
        flex justify-between items-center 
        py-0 px-[1rem] md:px-[7rem] 
        bg-white">
                <IoIosMenu size={60} 
                onClick={() => setIsOpen(true)}
                className="
                hover:cursor-pointer
                border-2 border-black rounded-md" />
                <Link to="/shop">
                <IoIosCart size={60} 
                onClick={() => console.log('cart!')}
                />
                </Link>
                <div className="text-right">
                    <h1 className="font-retro text-[1.5rem] md:text-[2.5rem] m-0 p-0">ERIn DaWn cAmPbELl</h1>
                    <h2 className="text-[.5rem] md:text-[1rem] text-gray-400 m-0 md:pb-4">Handmade Clothing & Upcycled Vintage</h2>
                </div>
            </div>
        </>
    )
}

