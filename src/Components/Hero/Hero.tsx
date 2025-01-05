import { PiLeaf, PiShootingStarLight } from "react-icons/pi";
import { GiSewingNeedle } from "react-icons/gi";



export default function Hero( { children }: { children: React.ReactNode }) {
    return (
        <div
            className="w-full h-fit 
            bg-white bg-opacity-80 
            my-10  pt-8
            border-y-4 border-yellow-400 border-double border-opacity-40
            flex flex-col justify-center items-center gap-[4rem]">
            {children}

            <div className="p-2 w-full bg-white">
                <div className="w-full flex justify-end items-start gap-2 h-17" >
                    <div className="text-sm md:text-xl m-auto w-fit flex flex-col md:flex-row justify-start items-center gap-4 py-2"><PiLeaf size={30} strokeWidth={1} className="inline" /> Sustainably Sourced</div>
                    <div className="text-sm md:text-xl m-auto w-fit flex flex-col md:flex-row justify-start items-center gap-4"><GiSewingNeedle size={30} strokeWidth={2} className="inline" /> Handcrafted</div>
                    <div className="text-sm md:text-xl m-auto w-fit flex flex-col md:flex-row justify-start items-center gap-4 py-2"><PiShootingStarLight strokeWidth={2} size={30} className="inline" /> One-of-a-kind</div>
                </div>
            </div>

        </div>

    )
}
