import Frame from "../Frame/Frame";

interface ILoadPhotos {
    count: number
    size: "small" | "medium" | "large"
}
export default function LoadPhotos({ count, size }: ILoadPhotos) {
    return (
        <>
            {Array(count).fill(0).map((_, i: number) => (
                <div key={i}
                    className={` p-4
                        ${size === "small" ? "w-[10rem] md:w-[12rem] lg:w-[14rem]" :
                            size === "medium" ? "w-[90vw] md:w-[19rem] lg:w-[22rem]" :
                                size == "large" && "w-[90vw] md:w-[36rem] lg:w-[42rem]"}
                        `}>
                    <Frame  >
                        <img src="images/card.jpg" alt="upcycled fabric" className="rounded-md" />
                    </Frame>
                </div>
            ))}
        </>
    );
}