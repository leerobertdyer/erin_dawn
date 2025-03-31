import { PiLeaf, PiShootingStarLight } from "react-icons/pi";
import { GiSewingNeedle } from "react-icons/gi";
import { Link } from "react-router-dom";

export default function Hero({ children }: { children: React.ReactNode }) {
    return (
        <>
        <div className="w-full flex items-center justify-center gap-4 bg-edcPurple-60 text-white">
            <p className="text-md md:text-2xl p-4 text-center">Browse My Handmade Clothing</p>
            <Link to="/shop" 
            className="p-2 rounded-md 
            text-center text-lg text-edcPurple-80 
            w-[6rem] md:w-[10rem] h-[2rem] 
            flex justify-center items-center
            bg-white border-2 border-edcYellow-20 hover:bg-edcYellow-20 hover:border-white">
                Shop
            </Link>
        </div>

        <div
            className="w-full 
            bg-white bg-opacity-80 
            my-10  overflow-hidden
            border-y-4 border-yellow-400 border-double border-opacity-40
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
