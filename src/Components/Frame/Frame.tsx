export default function Frame({ src, alt, name, size }: { src: string, alt: string, name?: string, size? : string }) {
    const calculateSize = (sizeMap: string) => {
        if (sizeMap.split(" ").length === 1) return { default: sizeMap, md: sizeMap, lg: sizeMap };
        else {
            return {
                default: sizeMap.split(" ")[0],
                md: sizeMap.split(" ")[1],
                lg: sizeMap.split(" ")[2]
            }
        }
    }

    size && console.log("md size: ", calculateSize(size).md)

    return (
        <div className={`
            ${size && calculateSize(size).default}
        ${size && calculateSize(size).md} ${size && calculateSize(size).lg}`}>
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
