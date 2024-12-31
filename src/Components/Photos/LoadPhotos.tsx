import Frame from "../Frame/Frame";

export default function LoadPhotos() {
    return (
        <>
            {Array(10).fill(0).map((_, i: number) => (
                <div key={i} className="flex-grow-0 flex-shrink-0 w-[9rem] md:w-[12rem] lg:w-[14rem]">
                    <Frame src="/images/erinFeather.jpg" alt="Erin Dawn Campbell" />
                </div>
            ))}
        </>
    );
}