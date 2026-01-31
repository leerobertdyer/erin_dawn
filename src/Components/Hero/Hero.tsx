import { PiLeaf, PiShootingStarLight } from "react-icons/pi";
import { GiSewingNeedle } from "react-icons/gi";
import { Link } from "react-router-dom";
import { IoIosMail } from "react-icons/io";

export default function Hero({ children }: { children: React.ReactNode }) {
    
    return (
        <>
        <div className="w-full min-h-[4rem] py-2 flex items-center justify-center bg-edcPurple-60 text-white">
            <Link to="/shop" 
            className="flex items-center justify-center w-full flex-wrap gap-2 text-lg md:text-2xl ">
                <div className="flex items-center justify-center gap-4 text-[1rem]">
                    Handmade From Vintage Fabrics
                    <button className="flex justify-center items-center p-2 rounded-md 
                        text-center text-lg text-edcPurple-80 
                        w-[6rem] md:w-[10rem] h-[2rem] 
                        bg-white border-2 border-edcYellow-40 hover:bg-edcYellow-40 hover:border-white">
                    Shop
                    </button>
                </div>
            </Link>
        </div>
        <Link to="/emailsignup"
        className="flex items-center justify-center gap-4 text-xs w-full bg-white text-edcPurple-60 hover:text-white hover:bg-edcPurple-60 hover:cursor-pointer hover:border-t-2 hover:border-double border-t-edcYellow-40">
            Join My Mailing List
            <IoIosMail size={30} strokeWidth={1} className="inline" />
        </Link>

        <div
            className="w-full 
            bg-white bg-opacity-80 
            my-10  overflow-hidden
            border-y-4 border-edcYellow-40 border-double border-opacity-40
            flex flex-col justify-center items-center gap-[1rem]">


            <div className="text-lg rounded-md flex flex-col items-center justify-center gap-4 mt-2">

            </div>
            {children}

            <div className="p-2 w-full bg-white">
                <div className="w-full flex justify-end items-start gap-2\\" >
                    <div className="text-sm md:text-xl m-auto w-fit flex flex-col md:flex-row justify-start items-center gap-4 py-2"><PiLeaf size={30} strokeWidth={1} className="inline" /> Sustainably Sourced</div>
                    <div className="text-sm md:text-xl m-auto w-fit flex flex-col md:flex-row justify-start items-center gap-4"><GiSewingNeedle size={30} strokeWidth={2} className="inline" /> Handcrafted</div>
                    <div className="text-sm md:text-xl m-auto w-fit flex flex-col md:flex-row justify-start items-center gap-4 py-2"><PiShootingStarLight strokeWidth={2} size={30} className="inline" /> One-of-a-kind</div>
                </div>
            </div>

        </div>





        </>

    )
}
