import { useState } from "react";
import { IoIosMenu, IoLogoInstagram } from "react-icons/io";
import { Link, useLocation } from "react-router";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { User } from "firebase/auth";

export default function Nav({ u }: { u: User | null }) {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation()

    const path = location.pathname
    console.log('path', path)
    return (
        <>
            {isOpen && <div className="w-full h-screen bg-black bg-opacity-50 fixed top-0 left-0 z-50"
                onClick={() => setIsOpen(false)}>

                <div className="flex justify-center items-center h-full">
                    <div className="flex flex-col 
                justify-center items-center 
                bg-black bg-opacity-35 
                w-[80vw] h-[80vh]
                md:w-[40vw] md:h-[60vh]
                border-2 border-white
                rounded-md gap-8">
                        <button className="text-pink-300 text-[4rem]">X</button>
                        <Link to="/" style={{ color: path === "/" ? 'skyblue' : 'white' }} className="text-[2rem]">Home</Link>
                        <Link to="/shop" style={{ color: path === "/shop" ? 'skyblue' : 'white' }} className="text-[2rem]">Shop</Link>
                        <Link to="/about" style={{ color: path === "/about" ? 'skyblue' : 'white' }} className="text-[2rem]">About</Link>
                        {u && <Link to="/admin" style={{ color: path === "/admin" ? 'skyblue' : 'white' }} className="text-[2rem]">Admin</Link>}
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
                <a href="https://www.instagram.com/erindawn_campbell" target="_blank" >
                    <IoLogoInstagram size={60} /></a>
                <Link to="/shop">
                    <HiOutlineShoppingCart size={60}
                        onClick={() => console.log('cart!')}
                    />
                </Link>
                <div className="text-right">
                    <Link to="/">
                        <h1 className="font-retro text-[1.5rem] md:text-[2.5rem] m-0 p-0">ERIn DaWn cAmPbELl</h1>
                    </Link>
                    <h2 className="text-[.5rem] md:text-[1rem] text-gray-400 m-0 md:pb-4">Handmade Clothing & Upcycled Vintage</h2>
                </div>
            </div>
        </>
    )
}

