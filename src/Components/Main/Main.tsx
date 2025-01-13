import Frame from "../Frame/Frame";

export default function Main() {
    return (
        <div
            className="w-full h-fit
            bg-white bg-opacity-80 
            py-8 px-4 flex-wrap
            border-y-4 border-yellow-400 border-double border-opacity-40
            flex flex-col sm:flex-row justify-center items-center gap-[4rem] ">
            <div className="w-fit">
                <Frame additionalClass="w-[95vw] md:w-[45vw] lg:w-[35vw]" hover={true} >
                    <img src="images/inventory/baroqueBlazer.jpg" alt="Curtain Dress" className="rounded-md" />
                    <button className="text-center text-lg">Embellished Vintage</button>
                </Frame>
            </div>
            <div className="w-fit">
                <Frame additionalClass="w-[95vw] md:w-[45vw] lg:w-[35vw]" hover={true} >
                    <img src="images/inventory/curtainDress.jpg" alt="Baroque Blazer" className="rounded-md"/>
                    <button className="text-center text-lg">Hand-Made Originals</button>
                </Frame>
            </div>
        </div>
    )
}