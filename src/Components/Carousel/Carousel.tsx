import { useEffect, useState } from "react";
import { ICarouselPhoto } from "../../Interfaces/IPhotos"

interface ICarouselParams {
    photos: ICarouselPhoto[];
    children: React.ReactNode;
}

export default function Carousel({ photos, children }: ICarouselParams) {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isSpinning && photos && photos.length > 1) {
            setCurrentPhotoIndex(1);
            interval = setInterval(() => {
                setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
            }, 1000);
            return () => {
                clearInterval(interval);
                setCurrentPhotoIndex(0);
                setIsSpinning(false);
            }
        }
        return () => {if (interval) clearInterval(interval)};
    }, [photos, isSpinning]);

    function handleMouseEnter() {
        if (photos.length > 1) {
            setIsSpinning(true);
        }
    }

    function handleMouseLeave() {
        setCurrentPhotoIndex(0);
        setIsSpinning(false);
    }
    return (
        <>
            <div className="flex flex-col w-full relative min-h-[40vh]" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <img src={photos[currentPhotoIndex].url} alt={photos[currentPhotoIndex].title} className="rounded-md " />
                {children}
            </div>
        </>
    )
}