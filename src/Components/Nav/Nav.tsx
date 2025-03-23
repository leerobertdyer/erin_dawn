import { useEffect, useRef, useState } from "react";
import { IoIosMenu, IoLogoInstagram } from "react-icons/io";
import { Link, useLocation } from "react-router";
import CartIconAndNumber from "../cartIconAndNumber/CartIconAndNumber";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { CiShop } from "react-icons/ci";
import { useUserContext } from "../../Context/UserContext";

export default function Nav() {
    const { cartProducts } = useProductManagementContext();
    const { user } = useUserContext();
    
    const cartLength = cartProducts.length;
    const [isOpen, setIsOpen] = useState(false);
    const [iconSize, setIconSize] = useState(60)
    const [isSmallScreen, setIsSmallScreen] = useState(false)
    const location = useLocation()
    const path = location.pathname

    //TODO: update menu so that it slowly accordsions open and closed for both mobile and desktop
    const menuRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        else document.removeEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);

    }, [isOpen])

    return (
        <>
            {isOpen && <div ref={menuRef} className="
            w-full h-[35vh] md:w-[40vh] md:h-full
            bg-white
            border-b-2 border-black border-r-2
            fixed top-0 left-0 z-50 
            text-[1rem] md:text-[2rem]
            flex flex-col justify-center md:justify-between items-center gap-2 md:gap-0">
                {!isSmallScreen && <IoIosMenu size={iconSize - 5} className="hover: cursor-pointer w-full h-20"
                    onClick={() => setIsOpen(false)} />}
                <div className="flex flex-col h-full w-full justify-center items-center gap-4 border-y-2 border-black">
                    <Link to="/"
                        className={`text-center select-none ${path === "/" ? "w-full bg-edcBlue-20" : ""} `}
                        onClick={() => setIsOpen(false)}
                    >Home</Link>
                    <Link to="/shop"
                        className={`text-center select-none ${path === "/shop" ? "w-full bg-edcBlue-20" : ""} `}
                        onClick={() => setIsOpen(false)}
                    >Shop</Link>
                    <Link to="/about"
                        className={`text-center select-none ${path === "/about" ? "w-full bg-edcBlue-20" : ""} `}
                        onClick={() => setIsOpen(false)}>
                        About</Link>
                    <Link to="/cart" className={`text-center select-none ${path === "/cart" ? "w-full bg-edcBlue-20" : ""} `}
                        onClick={() => setIsOpen(false)}>
                        Cart</Link>
                    {user && <Link to="/admin"
                        className={`text-center select-none ${path === "/admin" ? "w-full bg-edcBlue-20" : ""} `}
                        onClick={() => setIsOpen(false)}>
                        Admin</Link>}
                </div>
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
                <a href="https://www.instagram.com/erindawn_campbell" target="_blank" className="w-[3.5rem] flex justify-center" >
                    <IoLogoInstagram size={iconSize + 5} /></a>
              {cartLength > 0 
                ? <div className="w-[3.5rem] flex justify-center"><CartIconAndNumber cartLength={cartLength} iconSize={iconSize} /></div>
                : <Link to="/shop" className="w-[3.5rem] flex justify-center">
                    <CiShop  size={iconSize} />
                    </Link>
            }  
                <div className="text-right">
                    <Link to={user ? "/admin" : "/"}>
                        <h1 className="font-retro text-[1.25rem] md:text-[2.5rem] m-0 p-0">ERIn DaWn cAmPbELl</h1>
                    </Link>
                    <h2 className="text-[.5rem] md:text-[1rem] text-gray-400 m-0 md:pb-4">Handmade Clothing & Upcycled Vintage</h2>
                </div>
            </div>
        </>
    )
}

