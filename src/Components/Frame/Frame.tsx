import "./Frame.css";

export default function Frame({ src, alt, size, name }: { src: string, alt: string, size?: number, name?: string }) {
    const picWidth = size ? `${size * 50}vw` : '50vw';
    const picHeight = size ? `${size * 50}vw` : '40vw';
    return (
        <div
        style={{ width: picWidth, height: picHeight }} 
        >

        <div 
        className="
        hover:transform hover:scale-110
        rounded-[5px] 
        flex justify-center items-center 
        bg-white p-2 
        border-2 border-black
        h-fit w-fit">
            <div className="h-full w-full flex flex-col justify-between items-center">
                    <img src={src} alt={alt} className=" rounded-sm" />
                    <h2 className="text-[1.5rem] text-center bg-white p-2 h-[3rem] w-full" >"{name}"</h2>
            </div>
        </div>
            </div>
    )
}
