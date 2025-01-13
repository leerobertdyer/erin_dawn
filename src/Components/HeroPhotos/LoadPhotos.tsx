import Frame from "../Frame/Frame";

export default function LoadPhotos() {
    return (
        <>
            {Array(6).fill(0).map((_, i: number) => (
                <div key={i} className="flex-grow-0 flex-shrink-0
                        w-[10rem] md:w-[12rem] lg:w-[14rem]">
                    <Frame  additionalClass="w-[10rem] md:w-[12rem]" >
                        <img src="/images/card.jpg" alt="upcycled fabric" className="rounded-md"/>
                    </Frame>
                </div>
            ))}
        </>
    );
}