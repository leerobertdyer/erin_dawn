import Frame from "../Frame/Frame";


export default function Main() {
    return (
        <div
            className="w-full h-fit 
            bg-white bg-opacity-80 
            py-8 px-4 flex-wrap
            border-y-4 border-yellow-400 border-double border-opacity-40
            flex flex-col sm:flex-row justify-center items-center gap-[4rem]">
            <Frame src="images/inventory/baroqueBlazer.jpg" alt="Curtain Dress" name="Embellished Vintage" size="w-[19rem] md:flex-grow" hover={true}/>
            <Frame src="images/inventory/curtainDress.jpg" alt="Baroque Blazer" name="Hand-Made Originals" size="w-[19rem] md:flex-grow" hover={true}/>
        </div>
    )
}