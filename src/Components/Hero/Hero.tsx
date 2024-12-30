import { IoIosHeart, IoIosLeaf, IoIosThumbsUp } from "react-icons/io";
import Photos from "../Photos/Photos";

export default function Hero() {
    return (
        <div
            className="w-full h-fit 
        bg-white bg-opacity-45 my-20 py-8
        border-y-4 border-yellow-400 border-double border-opacity-40
        flex justify-around items-center">
            <div className="bg-pink-300 bg-opacity-20 p-4 w-fit h-fit rounded-full">
                <Photos />
            </div>
            <div className="w-[30vw] h-[100vh] bg-white bg-opacity-80 rounded-lg p-8
            flex flex-col justify-center items-center">
                <div className="w-full flex flex-col justify-center items-center gap-2">
                    <h3 className="text-xl w-[60%] m-auto flex justify-between gap-4 border-y-2 border-y-black py-2"><IoIosLeaf size={30} className="inline"/> Sustainably Sourced</h3>
                    <h3 className="text-xl w-[60%] m-auto flex justify-between gap-4"><IoIosThumbsUp size={30} className="inline"/> Handcrafted</h3>
                    <h3 className="text-xl w-[60%] m-auto flex justify-between gap-4 border-y-2 border-y-black py-2"><IoIosHeart size={30} className="inline"/> Made With Love</h3>
                    <img src="images/erin.jpg" alt="Erin Campbell" className="rounded-full" />
                </div>
            </div>
        </div>
    )
}
