export default function Frame({ src, alt, name }: { src: string, alt: string, name?: string }) {

    return (
        <div className="flex-grow">
            <div
                className="
        rounded-[5px] 
        flex justify-center items-center 
        bg-white p-2 
        border-2 border-black
        w-[100%] flex-grow">
                <div className="flex flex-col justify-between items-center h-full w-full">
                    <img src={src} alt={alt} className="rounded-sm object-cover flex-grow w-full min-h-[40vh]" />
                    { name && <h2 className="text-[1.5rem] text-center bg-white p-2  w-full" >"{name}"</h2> }
                </div>
            </div>
        </div>
    )
}
