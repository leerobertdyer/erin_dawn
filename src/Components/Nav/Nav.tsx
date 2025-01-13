import { useEffect, useState } from "react";
import { IoIosClose, IoIosMenu, IoLogoInstagram } from "react-icons/io";
import { Link, useLocation } from "react-router";
import { User } from "firebase/auth";
import CartIconAndNumber from "../cartIconAndNumber/CartIconAndNumber";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";

interface INav {
    u: User | null
}
export default function Nav({ u }: INav) {
    const { cartProducts } = useProductManagementContext();
    const cartLength = cartProducts.length;
    const [isOpen, setIsOpen] = useState(false);
    const [iconSize, setIconSize] = useState(60)
    const [isSmallScreen, setIsSmallScreen] = useState(false)
    const location = useLocation()
    const path = location.pathname

    //TODO: update menu so that it slowly accordsions open and closed for both mobile and desktop

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIconSize(40);
                setIsSmallScreen(true);
            } else {
                setIconSize(60);
                setIsSmallScreen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            {isOpen && <div className="
            w-full h-[30vh] md:w-[40vh] md:h-full
            bg-white 
            border-b-2 border-black 
            fixed top-0 left-0 z-50 
            flex flex-col justify-center md:justify-between items-center gap-4 md:gap-0">
                {!isSmallScreen && <IoIosMenu size={iconSize - 5} className="hover: cursor-pointer bg-edcPurple-20 w-full h-20"
                 onClick={() => setIsOpen(false)}  />}
                <Link to="/"
                    className={`text-[2rem] text-center select-none ${path === "/" ? "w-full bg-edcBlue-20" : ""} `}
                    onClick={() => setIsOpen(false)}
                >Home</Link>
                <Link to="/shop"
                    className={`text-[2rem] text-center select-none ${path === "/shop" ? "w-full bg-edcBlue-20" : ""} `}
                    onClick={() => setIsOpen(false)}
                >Shop</Link>
                <Link to="/about"
                    className={`text-[2rem] text-center select-none ${path === "/about" ? "w-full bg-edcBlue-20" : ""} `}
                    onClick={() => setIsOpen(false)}>
                    About</Link>
                {u && <Link to="/admin"
                    className={`text-[2rem] text-center select-none ${path === "/admin" ? "w-full bg-edcBlue-20" : ""} `}
                    onClick={() => setIsOpen(false)}>
                    Admin</Link>}
                <IoIosClose fill={"purple"} size={iconSize} className="hover: cursor-pointer" onClick={() => setIsOpen(false)} />
            </div>
            }

            <div className="
        w-full h-[13vh] md:h-[15vh] 
        flex justify-between items-center 
        py-0 px-[1rem] md:px-[7rem] 
        bg-white">
                <IoIosMenu size={iconSize - 5}
                    onClick={() => setIsOpen(true)}
                    className="
                hover:cursor-pointer
                border-2 border-black rounded-md" />
                <a href="https://www.instagram.com/erindawn_campbell" target="_blank" >
                    <IoLogoInstagram size={iconSize} /></a>
                <CartIconAndNumber cartLength={cartLength} iconSize={iconSize} />
                <div className="text-right">
                    <Link to="/">
                        <h1 className="font-retro text-[1.25rem] md:text-[2.5rem] m-0 p-0">ERIn DaWn cAmPbELl</h1>
                    </Link>
                    <h2 className="text-[.5rem] md:text-[1rem] text-gray-400 m-0 md:pb-4">Handmade Clothing & Upcycled Vintage</h2>
                </div>
            </div>
        </>
    )
}

